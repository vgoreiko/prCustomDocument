import { test, expect } from '@playwright/test';
import {AnnotationType} from './custom-annotation-types.enum';

const description = `Here will be the description of the test suite. With support of Markdown syntax.`

test.describe('Another section', {
  tag: '@feature2',
  annotation: {
    type: 'feature',
    description: 'Here will be the description of real feature. Now just a placeholder.',
  }
}, () => {
  test('has title', async ({ page }) => {
    test.info().annotations.push({
      type: AnnotationType.Feature,
      description: description
    })
    await page.goto('/');

    await expect(page).toHaveTitle(/app/i);
  });
})
