import { defineConfig } from '@playwright/test';
import { resolve } from 'node:path';

const validation = process.env.PORTFOLIO_SOURCE_ROOT
  ? resolve(process.env.PORTFOLIO_SOURCE_ROOT, '.azure/validation')
  : resolve('test-results');

export default defineConfig({
  testDir: './tests',
  outputDir: resolve(validation, 'react-test-results'),
  reporter: [['list'], ['json', { outputFile: resolve(validation, 'react-e2e.json') }]],
  workers: 1,
  timeout: 90000,
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/portfolio/',
    reuseExistingServer: true,
  },
  use: { baseURL: 'http://127.0.0.1:4173/portfolio/', channel: 'chrome', headless: true, launchOptions: { args: ['--enable-unsafe-swiftshader'] } },
});