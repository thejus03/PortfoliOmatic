import { test, expect } from '@playwright/test';

test.use({
  storageState: 'tests/setup/auth.json',
});

test('Test to see if saved login state is successful', async ({ page }) => {
  await page.goto('http://localhost:3000/home');
  await expect(page).toHaveURL(/\/home/);
});

test('Home page information rendered after login', async ({ page }) => {
  await page.goto('http://localhost:3000/home');
  await expect(page).toHaveURL(/\/home/);

  // Ensure Top performing ETFs are rendered
  await expect(page.getByText('Top Performing ETFs')).toBeVisible();
  await expect(page.getByTestId('top-etfs')).toBeVisible();

  // Ensure Latest News is rendered
  await expect(page.getByText('Latest News')).toBeVisible();
  await expect(page.getByTestId('latest-news')).toBeVisible();

  // Ensure the graph has been plotted
  await expect(page.getByText('Net Liquidity (SGD)')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('NAV Change (')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Daily P&L')).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId('graph')).toBeVisible({ timeout: 10000 });

});