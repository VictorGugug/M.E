import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:5173/?step=desktop',
    headless: true,
    viewport: { width: 1024, height: 768 },
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173/?step=desktop',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
