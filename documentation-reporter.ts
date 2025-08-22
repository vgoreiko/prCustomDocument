import {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface TestAnnotation {
  type: string;
  description: string;
}

interface SuiteAnnotation {
  type: string;
  description: string;
}

interface SuiteOptions {
  tag?: string;
  annotation?: SuiteAnnotation;
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

class DocumentationReporter implements Reporter {
  private outputDir = 'report';
  private documentationData: Map<string, DocumentationData> = new Map();

  onBegin(config: FullConfig, suite: Suite) {
    // Ensure report directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // Process the test suite structure
    this.processSuite(suite);
  }

  private processSuite(suite: Suite) {
    for (const child of suite.suites) {
      if (child.location?.file) {
        const filePath = child.location.file;
        const relativePath = path.relative(process.cwd(), filePath);

        // Extract suite information
        const suiteName = child.title;

        // Access suite metadata through _suiteOptions or similar internal property
        // Since Suite doesn't expose annotations directly, we'll extract from title or use a workaround
        let suiteDescription = '';
        let suiteTag = '';

        // Try to get suite options from internal properties (this is a workaround)
        const suiteInternal = child as any;
        if (suiteInternal._suiteOptions) {
          const options = suiteInternal._suiteOptions as SuiteOptions;
          suiteDescription = options.annotation?.description || '';
          suiteTag = options.tag || '';
        }

        // Fallback: extract from suite's spec file if needed
        if (!suiteDescription || !suiteTag) {
          const extracted = this.extractSuiteMetadata(filePath, suiteName);
          suiteDescription = suiteDescription || extracted.description;
          suiteTag = suiteTag || extracted.tag;
        }

        const docData: DocumentationData = {
          suiteName,
          suiteDescription,
          suiteTag,
          tests: [],
          filePath: relativePath
        };

        // Process tests in this suite
        for (const test of child.tests) {
          const sourceAnnotations = this.extractTestAnnotations(filePath, test.title);
          docData.tests.push({
            title: test.title,
            annotations: sourceAnnotations, // Start with source annotations, will be updated with runtime annotations
          });
        }

        this.documentationData.set(filePath, docData);
      }

      // Recursively process nested suites
      this.processSuite(child);
    }
  }

  private extractTestAnnotations(filePath: string, testTitle: string): TestAnnotation[] {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Find the test function by title - escape special regex characters
      const escapedTitle = testTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const testRegex = new RegExp(`test\\(['"\`]${escapedTitle}['"\`][^{]*{([^}]*(?:{[^}]*}[^}]*)*)`, 's');
      const match = content.match(testRegex);

      if (!match) {
        console.warn(`Could not find test body for: ${testTitle} in ${filePath}`);
        return [];
      }

      const testBody = match[1];
      const annotations: TestAnnotation[] = [];

      // Extract test.info().annotations.push() calls
      const annotationRegex = /test\.info\(\)\.annotations\.push\(\s*([^)]+)\s*\)/gs;
      let annotationMatch;

      while ((annotationMatch = annotationRegex.exec(testBody)) !== null) {
        const annotationCall = annotationMatch[1];

        // Handle both single annotation object and multiple annotation objects
        // First try to match multiple objects separated by commas
        const multipleObjectsRegex = /{[^}]*type:\s*AnnotationType\.(\w+)[^}]*description:\s*['"`]([^'"`]+)['"`][^}]*}/g;
        let objectMatch;

        while ((objectMatch = multipleObjectsRegex.exec(annotationCall)) !== null) {
          annotations.push({
            type: objectMatch[1],
            description: objectMatch[2]
          });
        }

        // If no multiple objects found, try to match single object
        if (annotations.length === 0) {
          const singleObjectRegex = /{\s*type:\s*AnnotationType\.(\w+)\s*,\s*description:\s*['"`]([^'"`]+)['"`]\s*}/;
          const singleMatch = annotationCall.match(singleObjectRegex);
          if (singleMatch) {
            annotations.push({
              type: singleMatch[1],
              description: singleMatch[2]
            });
          }
        }
      }

      // Debug logging
      if (annotations.length > 0) {
        console.log(`Extracted ${annotations.length} annotations for test "${testTitle}":`, annotations);
      } else {
        console.log(`No annotations found for test "${testTitle}" in ${filePath}`);
      }

      return annotations;
    } catch (error) {
      console.warn(`Could not extract annotations from ${filePath}:`, error);
      return [];
    }
  }

  private extractSuiteMetadata(filePath: string, suiteName: string): { description: string; tag: string } {
    try {
      // Read the test file to extract suite metadata
      const content = fs.readFileSync(filePath, 'utf8');

      // Extract tag using regex - look for tag in the test.describe options
      const tagMatch = content.match(/tag:\s*['"`]([^'"`]+)['"`]/);
      const tag = tagMatch ? tagMatch[1] : '';

      // Extract suite annotation description - escape special regex characters
      const escapedSuiteName = suiteName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Look for the test.describe call with the specific suite name and extract annotation
      const suitePattern = new RegExp(
        `test\\.describe\\(['"\`]${escapedSuiteName}['"\`]\\s*,\\s*{[^}]*annotation:\\s*{[^}]*description:\\s*['"\`]([^'"\`]+)['"\`][^}]*}[^}]*}\\)`,
        's'
      );
      
      const suiteDescribeMatch = content.match(suitePattern);
      const description = suiteDescribeMatch ? suiteDescribeMatch[1] : '';

      return { description, tag };
    } catch (error) {
      console.warn(`Could not extract metadata from ${filePath}:`, error);
      return { description: '', tag: '' };
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const filePath = test.location.file;
    const docData = this.documentationData.get(filePath);

    if (docData) {
      const testIndex = docData.tests.findIndex(t => t.title === test.title);
      if (testIndex !== -1) {
        // Convert Playwright annotations to our format, filtering out any with undefined descriptions
        const annotations: TestAnnotation[] = (result.annotations || [])
          .filter(ann => ann.description !== undefined)
          .map(ann => ({
            type: ann.type,
            description: ann.description!
          }));

        // Merge source annotations with runtime annotations (runtime takes precedence)
        if (annotations.length > 0) {
          docData.tests[testIndex].annotations = annotations;
        }
        // If no runtime annotations, keep the source annotations that were extracted during processSuite

        // Debug log to see what annotations we're getting
        console.log(`Test: ${test.title}`);
        console.log(`Annotations found:`, annotations);
      }
    }
  }

  onEnd() {
    for (const [filePath, docData] of this.documentationData) {
      this.generateDocumentationFile(docData);
    }

    console.log(`\n📚 Documentation generated in '${this.outputDir}' folder`);
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
    content += `*Generated on ${new Date().toISOString()} by Playwright Documentation Reporter*\n`;
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

export default DocumentationReporter;
