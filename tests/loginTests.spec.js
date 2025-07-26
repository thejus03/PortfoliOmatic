import { test, expect } from '@playwright/test';

// Helper to generate random email and password
const generateRandomCredentials = () => {
  const random = Math.floor(Math.random() * 1000000);
  return {
    email: `testuser${random}@gmail.com`,
    password: `P@ssword${random}!`
  };
};

test('New user signup and ultra low risk portfolio selection flow', async ({ page }) => {
  const { email, password } = generateRandomCredentials();
  console.log(`Signing up with ${email} / ${password}`);

  // Go to registration page
  await page.goto('http://localhost:3000/register');

  // Fill in signup form
  await page.fill('input[placeholder="me@example.com"]', email);
  await page.fill('input[placeholder="Choose a password"]', password);
  await page.fill('input[placeholder="Confirm Password"]', password);

  await page.getByRole('button', { name: /Create Account/ }).click();

  // Wait for navigation to risk assessment page
  await page.waitForURL('**/account-setup/risk-preference');
  await expect(page).toHaveURL(/\/account-setup\/risk-preference$/);
  await page.getByTestId('risk-next').click();

  // Background section
  await page.waitForURL('**/account-setup/background');
  await expect(page).toHaveURL(/\/account-setup\/background$/);
  await page.getByTestId('risk-next').click();

  // Behavioural section
  await page.waitForURL('**/account-setup/behavioural');
  await expect(page).toHaveURL(/\/account-setup\/behavioural$/);
  await page.getByRole('button', { name: 'Submit' }).click();

  // Wait for portfolio suggestions page
  await page.waitForURL('**/account-setup/portfolio-suggestions');
  await expect(page).toHaveURL(/\/account-setup\/portfolio-suggestions/);

  // If "Try Again" is seen, click it
  const refreshButton = page.getByTestId('try-again');
  if (await refreshButton.isVisible().catch(() => false)) {
    await refreshButton.click();
  }

  // Click select portfolio
  await page.getByRole('button', { name: 'Select Portfolio' }).click();

  // Check if the correct order ticket has been generated
  await page.waitForURL('**/trade?pid=1');
  await page.getByRole('dialog', { name: 'Order Ticket' }).waitFor(); 
});
