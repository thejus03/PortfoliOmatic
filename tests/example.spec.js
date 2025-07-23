import { test, expect } from '@playwright/test';

// Helper to generate random email and password
const generateRandomCredentials = () => {
  const random = Math.floor(Math.random() * 1000000);
  return {
    email: `testuser${random}@gmail.com`,
    password: `P@ssword${random}!`
  };
};

test('New user signup and portfolio selection flow', async ({ page }) => {
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
  await page.waitForURL('**/account-setup/risk-assessment');
  await expect(page).toHaveURL(/\/account-setup\/risk-assessment$/);

  // Simulate answering risk questions
  await page.getByRole('button', { name: /Next/ }).click();

  // Background section
  await page.waitForURL('**/account-setup/background');
  await expect(page).toHaveURL(/\/account-setup\/background$/);
  await page.getByRole('button', { name: /Next/ }).click();

  // Behavioural section
  await page.waitForURL('**/account-setup/behavioural');
  await expect(page).toHaveURL(/\/account-setup\/behavioural$/);
  await page.getByRole('button', { name: /Submit/ }).click();

  // Wait for portfolio suggestions page
  await page.waitForURL('**/account-setup/portfolio-suggestions');
  await expect(page).toHaveURL(/\/account-setup\/portfolio-suggestions$/);

  // Wait for loading state to disappear
  await page.waitForSelector('text=Loading Portfolio Suggestions', { state: 'detached', timeout: 10000 });

  // Click select portfolio
  await page.click('text=Select Portfolio');

  // Optional: verify what page you're on now or what happens after selection
  console.log('Signup flow completed successfully.');
});
