const { test, expect } = require('@playwright/test');

const BASE = process.env.BASE_URL || 'http://localhost:5173';

async function loginAs(page, username, password, role, expectedName) {
  await page.goto(BASE + '/');
  await expect(page).toHaveURL(BASE + '/');
  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.selectOption('#role', role);
  await page.click('button:has-text("Masuk")');
  await page.waitForURL('**/dashboard**', { timeout: 5000 });
  await expect(page.locator('.welcome-text')).toContainText(`Halo, ${expectedName}`);
  await expect(page.locator('#spreadsheet-embed iframe')).toBeVisible();
}

test.describe('Login flow', () => {
  test('Admin Office can login and see dashboard', async ({ page }) => {
    await loginAs(page, 'adminoffice', 'office123', 'admin-office', 'Admin Office');
  });

  test('Admin Teknik can login and see dashboard', async ({ page }) => {
    await loginAs(page, 'admintkn', 'teknik123', 'admin-teknik', 'Admin Teknik');
  });

  test('Owner can login and see dashboard', async ({ page }) => {
    await loginAs(page, 'owner', 'owner123', 'owner', 'Owner');
  });

  test('Style guide is accessible from login screen', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.click('a:has-text("Lihat Figma Style Guide")');
    await page.waitForURL('**/style-guide');
    await expect(page.locator('h2')).toHaveText('Figma Style Guide');
  });
});
