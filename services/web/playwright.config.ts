import { defineConfig } from '@playwright/test';
import { resolve } from 'node:path';

const validation = process.env.PORTFOLIO_SOURCE_ROOT
  ? resolve(process.env.PORTFOLIO_SOURCE_ROOT, '.azure/validation')
  : resolve('test-results');
const previewPort = process.env.PORTFOLIO_PREVIEW_PORT ?? '4173';
const previewUrl = `http://127.0.0.1:${previewPort}/portfolio/`;

export default defineConfig({
  testDir: './tests',
  outputDir: resolve(validation, 'react-test-results'),
  reporter: [['list'], ['json', { outputFile: resolve(validation, 'react-e2e.json') }]],
  workers: 1,
  timeout: 90000,
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${previewPort} --strictPort`,
    url: previewUrl,
    reuseExistingServer: true,
  },
  use: { baseURL: previewUrl, channel: 'chrome', headless: true, launchOptions: { args: ['--enable-unsafe-swiftshader'] } },
});