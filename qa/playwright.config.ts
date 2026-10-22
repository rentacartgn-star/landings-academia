// [A6] Playwright contra un build de producción (`next start`). Ver qa/REPORT.md para cómo arrancarlo.
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.QA_BASE_URL ?? 'http://localhost:3156';

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: Number(process.env.QA_WORKERS ?? 4),
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'results/playwright.json' }]],
  outputDir: 'results/artifacts',
  use: {
    baseURL,
    // iPhone 13/14 = 390 px de ancho
    ...devices['iPhone 13'],
    browserName: 'chromium',
    // UA de Safari iOS real: con el de HeadlessChrome el tracker nos cuenta como bot (`0;bot`).
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    locale: 'es-ES',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
