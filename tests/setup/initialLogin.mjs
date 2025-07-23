import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');

  await page.fill('input[placeholder="Email"]', 'thejusunni@hotmail.com');
  await page.fill('input[placeholder="Password"]', 'foobar');

  await page.getByRole('button', { name: /Log In/ }).click();

  await page.waitForURL(/\/home|\/account-setup/);

  // Save login state
  await page.context().storageState({ path: 'tests/setup/auth.json' });

  await browser.close();
  console.log('Logged in and session saved');
})();


