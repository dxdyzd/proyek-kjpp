const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests/playwright',
  timeout: 30_000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
