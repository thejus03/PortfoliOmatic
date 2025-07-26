import { test, expect } from '@playwright/test';

test.use({
  storageState: 'tests/setup/auth.json',
});

test('Portfolio performance chart renders', async ({ page }) => {
    await page.goto('http://localhost:3000/portfolios');

    // Ensure the graphs have been plotted
    await expect(page.getByText('Conservative Income Portfolio')).toBeVisible({ timeout: 30000 });
    await expect(page.getByText('Growth-Oriented Portfolio')).toBeVisible({ timeout: 30000 });

    const firstGraph = page.locator('.recharts-area-area').nth(0);
    const secondGraph = page.locator('.recharts-area-area').nth(1);

    await expect(firstGraph).toBeVisible({ timeout: 10000 });
    await expect(secondGraph).toBeVisible({ timeout: 10000 });

    // Ensure the pie charts have been plotted
    await page.waitForTimeout(5000)
    const assetClassElements = page.locator('p', { hasText: 'Asset Class' });
    await expect(assetClassElements).toHaveCount(2);

    const bondElements = page.locator('p', { hasText: 'Bond Breakdown' });
    await expect(bondElements).toHaveCount(2);

    const goldElements = page.locator('p', { hasText: 'Gold Breakdown' });
    await expect(goldElements).toHaveCount(1);

    const equityElements = page.locator('p', { hasText: 'Equity Breakdown' });
    await expect(equityElements).toHaveCount(1);

    });