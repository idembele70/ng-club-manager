import { ENV, ENV_CONFIG } from './e2e/config/env.config';
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  tsconfig: './e2e/tsconfig.json',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env['CI'],
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env['CI'] ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: ENV_CONFIG[ENV].baseURL.front,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // headless: false,
    trace: 'on-first-retry',
    // screenshot: 'on-first-failure',
    // video: 'on'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'local-fr',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'fr-FR',
        timezoneId: 'Europe/Paris',
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: ENV_CONFIG.local.baseURL.front,
    reuseExistingServer: !process.env['CI'],
  },
});
