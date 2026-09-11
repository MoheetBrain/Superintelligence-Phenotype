import { defineConfig, devices } from '@playwright/test';
const dev = process.env.E2E_DEV === '1';
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: dev ? 'http://127.0.0.1:3016' : 'http://127.0.0.1:4173',
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: dev ? 'npm run dev' : 'npm run preview',
    url: dev ? 'http://127.0.0.1:3016' : 'http://127.0.0.1:4173',
    reuseExistingServer: true,
  },
  projects: [{ name: 'chromium' }],
});
