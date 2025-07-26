import { test, expect } from '@playwright/test';

test.use({
  storageState: 'tests/setup/auth.json',
});

test('Consecutive buy and sell', async ({ page }) => {
    // Go to the trade page
    await page.goto('http://localhost:3000/trade');
    await expect(page).toHaveURL(/\/trade/);

    // Click on the buy button for the Balanced Growth Portfolio
    await page.getByTestId('Card Buy 6').click();

    // Wait for the order ticket to be generated
    await page.getByRole('dialog', { name: 'Order Ticket' }).waitFor(); 

    // Enter Purchase Amount of $500
    await page.getByRole('spinbutton').fill('500');

    // Click the buy button after filling in amount
    await page.getByTestId('Drawer Buy 6').click();

    // Click on the confirm button after filling in the amount
    await page.getByTestId('Confirm Buy 6').click();

    // Confirm if the $500 has been purchased successfully
    await expect(page.locator('body')).toContainText('500', { timeout: 10000 });

    // Now go to sell tab
    await page.waitForTimeout(3000);
    await page.getByTestId('Sell Tab').click()

    // Liquidate the new portfolio
    await page.getByTestId('Card Sell 6').click();
    await page.getByRole('dialog', { name: 'Order Ticket' }).waitFor(); 
    await page.getByTestId('Liquidate').click();
    await page.getByTestId('Confirm Sell 6').click();

    // Check if portfolio has been sold off
    await expect(page.getByTestId('Card Sell 6')).toHaveCount(0);
});