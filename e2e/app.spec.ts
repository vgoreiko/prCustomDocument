import { test, expect } from '@playwright/test';
import {AnnotationType} from './custom-annotation-types.enum';

test.describe('Angular App E2E Tests', {
  tag: '@feature1',
  annotation: {
    type: 'feature',
    description: 'Initial page',
  }
}, () => {
  test('displays welcome message', async ({ page }) => {
    test.info().annotations.push(
      { type: AnnotationType.Description, description: 'Navigate to the home page and see the welcome message.' },
      { type: AnnotationType.Step, description: 'Navigate to the home page' },
      { type: AnnotationType.Expected, description: 'Welcome test should be "Hello"' },
      { type: AnnotationType.Expected, description: 'Page title should be "app"' }
    );
    await page.goto('/');

    const welcomeText = page.locator('h1');
    await expect(welcomeText).toContainText('Hello');

    const title = await page.title();
    expect(title).toBeTruthy();
  });
})
