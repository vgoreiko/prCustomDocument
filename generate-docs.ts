import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface TestAnnotation {
  type: string;
  description: string;
}

interface DocumentationData {
  suiteName: string;
  suiteDescription: string;
  suiteTag: string;
  tests: {
    title: string;
    annotations: TestAnnotation[];
  }[];
  filePath: string;
}

class DocumentationGenerator {
  private outputDir = 'report';

  async generateDocumentation() {
    // Ensure report directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // Find all test files
    const testFiles = await glob('e2e/**/*.spec.ts');
    
    for (const filePath of testFiles) {
      try {
        const docData = this.processTestFile(filePath);
        if (docData) {
          this.generateDocumentationFile(docData);
        }
      } catch (error) {
        console.warn(`Error processing ${filePath}:`, error);
      }
    }

    console.log(`\n📚 Documentation generated in '${this.outputDir}' folder`);
  }

  private processTestFile(filePath: string): DocumentationData | null {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);

      console.log(`\nProcessing file: ${filePath}`);

      // Extract suite information - make regex more flexible
      const suiteMatch = content.match(/test\.describe\(['"`]([^'"`]+)['"`]\s*,\s*{([^}]*(?:{[^}]*}[^}]*)*)}\s*,\s*\(\)\s*=>\s*{/s);
      
      if (!suiteMatch) {
        console.warn(`Could not find test.describe in ${filePath}`);
        return null;
      }

      const suiteName = suiteMatch[1];
      const suiteOptions = suiteMatch[2];
      console.log(`Suite name: ${suiteName}`);

      // Extract suite metadata - improve regex patterns
      const tagMatch = suiteOptions.match(/tag:\s*['"`]([^'"`]+)['"`]/);
      const tag = tagMatch ? tagMatch[1] : '';

      // Look for annotation.description in suite options
      const annotationMatch = suiteOptions.match(/annotation:\s*{[^}]*description:\s*['"`]([^'"`]+)['"`][^}]*}/);
      const description = annotationMatch ? annotationMatch[1] : '';

      // Extract the describe block body
      const describeStartMatch = content.match(/test\.describe\([^{]*{[^}]*}[^}]*}\s*,\s*\(\)\s*=>\s*{/s);
      if (!describeStartMatch) {
        console.warn(`Could not find describe block start in ${filePath}`);
        return null;
      }
      
      const startIndex = describeStartMatch.index! + describeStartMatch[0].length;
      const remainingContent = content.substring(startIndex);
      
      // Find the matching closing brace by counting braces
      let braceCount = 1;
      let endIndex = 0;
      for (let i = 0; i < remainingContent.length; i++) {
        if (remainingContent[i] === '{') braceCount++;
        if (remainingContent[i] === '}') braceCount--;
        if (braceCount === 0) {
          endIndex = i;
          break;
        }
      }
      
      if (endIndex === 0) {
        console.warn(`Could not find describe block end in ${filePath}`);
        return null;
      }
      
      const describeBody = remainingContent.substring(0, endIndex);
      console.log(`Describe body length: ${describeBody.length}`);
      console.log(`Describe body preview: ${describeBody.substring(0, 200)}...`);

      // Extract test functions using a simpler approach
      const tests: { title: string; annotations: TestAnnotation[] }[] = [];
      
      // Find all test() calls in the describe body
      let testIndex = 0;
      while (true) {
        const testStart = describeBody.indexOf('test(', testIndex);
        if (testStart === -1) break;
        
        // Find the test title
        const titleStart = describeBody.indexOf("'", testStart) + 1;
        const titleEnd = describeBody.indexOf("'", titleStart);
        if (titleStart === -1 || titleEnd === -1) {
          testIndex = testStart + 1;
          continue;
        }
        
        const testTitle = describeBody.substring(titleStart, titleEnd);
        
        // Find the opening brace after the test function signature
        const braceStart = describeBody.indexOf('{', titleEnd);
        if (braceStart === -1) {
          testIndex = titleEnd + 1;
          continue;
        }
        
        // For async functions, we need to find the brace after the =>
        // Look for the arrow function pattern: async ({ page }) => {
        const arrowPattern = /async\s*\([^)]*\)\s*=>\s*{/;
        const arrowMatch = describeBody.substring(titleEnd).match(arrowPattern);
        
        let actualBraceStart = braceStart;
        if (arrowMatch) {
          // Find the brace after the arrow function
          const arrowEnd = titleEnd + describeBody.substring(titleEnd).indexOf(arrowMatch[0]) + arrowMatch[0].length - 1;
          actualBraceStart = arrowEnd;
        }
        
        // Find the matching closing brace
        let braceCount = 1;
        let braceEnd = actualBraceStart + 1;
        while (braceEnd < describeBody.length && braceCount > 0) {
          if (describeBody[braceEnd] === '{') braceCount++;
          if (describeBody[braceEnd] === '}') braceCount--;
          braceEnd++;
        }
        
        if (braceCount === 0) {
          const testBody = describeBody.substring(actualBraceStart + 1, braceEnd - 1);
          console.log(`Found test: ${testTitle}`);
          console.log(`Test body length: ${testBody.length}`);
          console.log(`Test body preview: ${testBody.substring(0, 200)}...`);
          console.log(`Brace start: ${actualBraceStart}, Brace end: ${braceEnd}`);
          console.log(`Raw test body: "${testBody}"`);
          
          const annotations = this.extractTestAnnotations(testBody, filePath);
          console.log(`Annotations found: ${annotations.length}`);
          
          tests.push({
            title: testTitle,
            annotations
          });
        }
        
        testIndex = braceEnd;
      }

      console.log(`Total tests found: ${tests.length}`);

      return {
        suiteName,
        suiteDescription: description,
        suiteTag: tag,
        tests,
        filePath: relativePath
      };
    } catch (error) {
      console.warn(`Error processing ${filePath}:`, error);
      return null;
    }
  }

  private extractTestAnnotations(testBody: string, filePath: string): TestAnnotation[] {
    const annotations: TestAnnotation[] = [];

    // Extract test.info().annotations.push() calls
    const annotationRegex = /test\.info\(\)\.annotations\.push\(\s*([^)]+)\s*\)/gs;
    let annotationMatch;

    while ((annotationMatch = annotationRegex.exec(testBody)) !== null) {
      const annotationCall = annotationMatch[1];

      // Handle both single annotation object and multiple annotation objects
      // First try to match multiple objects separated by commas
      const multipleObjectsRegex = /{[^}]*type:\s*AnnotationType\.(\w+)[^}]*description:\s*(['"`])([\s\S]*?)\2[^}]*}/g;
      let objectMatch;

      while ((objectMatch = multipleObjectsRegex.exec(annotationCall)) !== null) {
        annotations.push({
          type: objectMatch[1],
          description: objectMatch[3]
        });
      }

      // If no multiple objects found, try to match single object
      if (annotations.length === 0) {
        // Try to match single object with variable reference in description
        const singleObjectRegex = /{\s*type:\s*AnnotationType\.(\w+)\s*,\s*description:\s*([^,}]+)\s*}/;
        const singleMatch = annotationCall.match(singleObjectRegex);
        if (singleMatch) {
          // Clean up the description (remove quotes if present, trim whitespace)
          let description = singleMatch[2].trim();
          if ((description.startsWith('"') && description.endsWith('"')) || 
              (description.startsWith("'") && description.endsWith("'"))) {
            description = description.slice(1, -1);
          } else {
            // Try to resolve variable reference
            const resolvedDescription = this.resolveVariableReference(description, filePath);
            if (resolvedDescription) {
              description = resolvedDescription;
            }
          }
          
          annotations.push({
            type: singleMatch[1],
            description: description
          });
        }
      }
    }

    // Debug logging
    if (annotations.length > 0) {
      console.log(`Extracted ${annotations.length} annotations:`, annotations);
    } else {
      console.log(`No annotations found in test body. Annotation call: ${testBody.match(/test\.info\(\)\.annotations\.push\([^)]*\)/)?.[0] || 'Not found'}`);
    }

    return annotations;
  }

  private resolveVariableReference(varName: string, filePath: string): string | null {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Look for const/let/var declarations
      const constMatch = content.match(new RegExp(`const\\s+${varName}\\s*=\\s*['"\`]([^'"\`]+)['"\`]`));
      if (constMatch) {
        return constMatch[1];
      }
      
      const letMatch = content.match(new RegExp(`let\\s+${varName}\\s*=\\s*['"\`]([^'"\`]+)['"\`]`));
      if (letMatch) {
        return letMatch[1];
      }
      
      const varMatch = content.match(new RegExp(`var\\s+${varName}\\s*=\\s*['"\`]([^'"\`]+)['"\`]`));
      if (varMatch) {
        return varMatch[1];
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  private generateDocumentationFile(docData: DocumentationData) {
    const content = this.generateMarkdownContent(docData);

    // Create nested directory structure
    const relativePath = docData.filePath;
    const parsedPath = path.parse(relativePath);
    const outputPath = path.join(this.outputDir, parsedPath.dir);

    // Ensure directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // Write markdown file
    const fileName = parsedPath.name + '.md';
    const fullPath = path.join(outputPath, fileName);

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Generated: ${fullPath}`);
  }

  private generateMarkdownContent(docData: DocumentationData): string {
    let content = '';

    // Header
    content += `# ${docData.suiteName}\n\n`;

    // Tag
    if (docData.suiteTag) {
      content += `**Tag:** \`${docData.suiteTag}\`\n\n`;
    }

    // Suite description
    if (docData.suiteDescription) {
      content += `## Description\n\n${docData.suiteDescription}\n\n`;
    }

    // Tests section
    content += `## Test Cases\n\n`;

    for (const test of docData.tests) {
      content += `### ${test.title}\n\n`;

      if (test.annotations.length === 0) {
        content += `*No annotations found for this test.*\n\n`;
      } else {
        // Group annotations by type
        const annotationsByType = this.groupAnnotationsByType(test.annotations);

        // Feature description
        if (annotationsByType['Feature']?.length > 0) {
          content += `#### Feature\n\n`;
          annotationsByType['Feature'].forEach(annotation => {
            content += `${annotation.description}\n\n`;
          });
        }

        // Test description
        if (annotationsByType['Description']?.length > 0) {
          content += `#### Description\n\n`;
          annotationsByType['Description'].forEach(annotation => {
            content += `${annotation.description}\n\n`;
          });
        }

        // Steps
        if (annotationsByType['Step']?.length > 0) {
          content += `#### Steps\n\n`;
          annotationsByType['Step'].forEach((annotation, index) => {
            content += `${index + 1}. ${annotation.description}\n`;
          });
          content += `\n`;
        }

        // Expected results
        if (annotationsByType['Expected']?.length > 0) {
          content += `#### Expected Results\n\n`;
          annotationsByType['Expected'].forEach(annotation => {
            content += `- ${annotation.description}\n`;
          });
          content += `\n`;
        }
      }

      content += `---\n\n`;
    }

    // Footer with generation info
    content += `---\n\n`;
    content += `*Generated on ${new Date().toISOString()} by Documentation Generator*\n`;
    content += `*Source file: \`${docData.filePath}\`*\n`;

    return content;
  }

  private groupAnnotationsByType(annotations: TestAnnotation[]): Record<string, TestAnnotation[]> {
    const grouped: Record<string, TestAnnotation[]> = {};

    for (const annotation of annotations) {
      if (!grouped[annotation.type]) {
        grouped[annotation.type] = [];
      }
      grouped[annotation.type].push(annotation);
    }

    return grouped;
  }
}

// Run the generator
const generator = new DocumentationGenerator();
generator.generateDocumentation().catch(console.error);