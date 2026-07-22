import { expect, test } from '@playwright/test';

test('la homepage carga y muestra la marca TekoApp', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'TekoApp' })).toBeVisible();
});
