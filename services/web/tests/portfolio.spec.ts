import { test, expect, type Page } from '@playwright/test';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { portfolio, type Detail } from '../src/data/portfolio';

const previewUrl = `http://127.0.0.1:${process.env.PORTFOLIO_PREVIEW_PORT ?? '4173'}/portfolio/`;
const evidence = process.env.PORTFOLIO_SOURCE_ROOT
  ? resolve(process.env.PORTFOLIO_SOURCE_ROOT, '.azure/validation/react')
  : resolve('test-results/evidence');
mkdirSync(evidence, { recursive: true });
const detailText = (details: Detail[]) => details.flatMap(detail => [detail.label, detail.value]);
const source = {
  blocks: [portfolio.name, portfolio.role, portfolio.introduction, portfolio.coreTools,
    ...portfolio.roles.flatMap(role => [role.date, role.title, role.role, ...role.bullets]),
    ...portfolio.projects.flatMap(project => [project.status, project.title, project.summary, ...detailText(project.details)]),
    ...portfolio.supplements.flatMap(supplement => [supplement.title, ...detailText(supplement.details)]),
    ...portfolio.publications.flatMap(publication => [publication.venue, publication.title]),
    ...portfolio.education.flatMap(education => [education.date, education.title, education.institution, education.grade]),
    ...detailText(portfolio.skills), portfolio.focus, portfolio.interests],
  links: ['#main', '#desk', '#experience', '#work', '#publications', '#education', '#skills', '#contact', '/portfolio/resume.pdf', portfolio.email, portfolio.linkedin, ...portfolio.publications.map(publication => publication.url)],
  fragments: ['main', 'experience', 'work', 'publications', 'education', 'skills', 'contact'],
};
const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();

test('every production file is served unchanged under the configured base', async ({ request }) => {
  const output = resolve('dist');
  const files = readdirSync(output, { recursive: true, withFileTypes: true }).filter(entry => entry.isFile());
  expect(files.length).toBeGreaterThan(0);
  for (const file of files) {
    const filename = resolve(file.parentPath, file.name);
    const relative = filename.slice(output.length + 1).replaceAll('\\', '/');
    const route = relative === 'index.html' ? '/portfolio/' : `/portfolio/${relative}`;
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    expect((await response.body()).equals(readFileSync(filename)), route).toBe(true);
    if (relative !== 'index.html') expect(response.headers()['content-type'], route).not.toContain('text/html');
  }
});

async function parity(page: Page) {
  const text = normalize(await page.locator('main').textContent() ?? '') + ' ' + normalize(await page.locator('footer').textContent() ?? '');
  for (const block of source.blocks) expect(text, block).toContain(block);
  const links = await page.locator('a').evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href')));
  for (const link of source.links) expect(links).toContain(link);
  for (const id of source.fragments) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  await expect(page.locator('.project')).toHaveCount(7);
  await expect(page.locator('.role-entry')).toHaveCount(2);
}

test('production HTML preserves all public copy and fragments', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(previewUrl);
  await parity(page);
  await page.screenshot({ path: `${evidence}/no-javascript.png`, fullPage: true });
  await context.close();
});

test('reading sections match the dark profile and retain readable print styles', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#publications');
  await expect(page.locator('.reading-band')).toHaveCSS('background-color', 'rgb(20, 22, 24)');
  await expect(page.locator('.reading-band')).toHaveCSS('color', 'rgb(243, 244, 242)');
  await expect(page.locator('.publication .meta').first()).toHaveCSS('color', 'rgb(232, 198, 106)');
  await expect(page.locator('.publication a').first()).toHaveCSS('color', 'rgb(105, 215, 196)');
  await expect(page.locator('#contact')).toHaveCSS('background-color', 'rgb(20, 22, 24)');
  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844], ['narrow', 320, 740]] as const) {
    await page.setViewportSize({ width, height });
    for (const section of ['publications', 'education', 'skills', 'contact']) {
      await page.evaluate(id => document.getElementById(id)?.scrollIntoView(), section);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name} ${section}`).toBe(true);
      if (name !== 'narrow') await page.screenshot({ path: `${evidence}/${name}-${section}.png` });
    }
  }
  await parity(page);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.reading-band')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('.reading-band')).toHaveCSS('background-image', 'none');
  await expect(page.locator('.publication h3').first()).toHaveCSS('color', 'rgb(0, 0, 0)');
  await expect(page.locator('#contact')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
});

test('responsive views, real canvas variation, camera stations and pause', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => { Object.defineProperty(navigator, 'hardwareConcurrency', { value: 12 }); });
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/graphics-on/, { timeout: 30000 });
  await parity(page);
  for (const [name, width, height] of [['desktop', 1440, 900], ['wide', 1920, 1080], ['mobile', 390, 844], ['narrow', 320, 740], ['landscape', 844, 390], ['zoom-equivalent', 720, 450]] as const) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${evidence}/${name}.png` });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), name).toBe(true);
    const overlaps = await page.locator('.hero-copy h1,.hero-copy p').evaluateAll(elements => elements.slice(1).filter((element, index) => element.getBoundingClientRect().top < elements[index].getBoundingClientRect().bottom - 1).length);
    expect(overlaps, name).toBe(0);
    const copy = await page.locator('.hero-copy').boundingBox();
    expect(copy).not.toBeNull();
    expect(Math.abs(copy!.x + copy!.width / 2 - width / 2), `${name} centered introduction`).toBeLessThan(2);
    await expect(page.locator('.hero-copy')).toHaveCSS('text-align', 'center');
    await expect(page.locator('.hero-actions')).toHaveCSS('justify-content', 'center');
    if (name === 'desktop' || name === 'mobile') {
      const overlayMask = await page.addStyleTag({ content: '.masthead,.hero-copy,.section-inner,.next-section,.scene-controls,.footer { visibility: hidden !important; }' });
      const pixels = await page.locator('canvas').screenshot({ path: `${evidence}/${name}-canvas.png` });
      await overlayMask.evaluate(element => element.remove());
      const image = await loadImage(pixels);
      const surface = createCanvas(image.width, image.height);
      const context = surface.getContext('2d');
      context.drawImage(image, 0, 0);
      const { data } = context.getImageData(0, 0, image.width, image.height);
      const colors = new Set<string>();
      let litPixels = 0;
      let firstLitRow = image.height;
      let leftmostLitPixel = image.width;
      let rightmostLitPixel = 0;
      for (let offset = 0; offset < data.length; offset += 16) {
        colors.add(`${data[offset] >> 4},${data[offset + 1] >> 4},${data[offset + 2] >> 4}`);
        if (Math.max(data[offset], data[offset + 1], data[offset + 2]) > 120) {
          litPixels++;
          firstLitRow = Math.min(firstLitRow, Math.floor(offset / 4 / image.width));
          leftmostLitPixel = Math.min(leftmostLitPixel, offset / 4 % image.width);
          rightmostLitPixel = Math.max(rightmostLitPixel, offset / 4 % image.width);
        }
      }
      expect(colors.size, `${name} scene colors`).toBeGreaterThan(30);
      expect(litPixels, `${name} visible desk pixels`).toBeGreaterThan(100);
      expect(Math.abs((leftmostLitPixel + rightmostLitPixel) / 2 - image.width / 2), `${name} centered desk`).toBeLessThan(image.width * .15);
      if (name === 'desktop') expect(firstLitRow, 'desk below introduction').toBeGreaterThan(copy!.y + copy!.height);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  const masking = await page.addStyleTag({ content: '.masthead,.hero-copy,.section-inner,.next-section,.scene-controls,.footer { visibility: hidden !important; }' });
  const before = await page.locator('canvas').screenshot({ path: `${evidence}/canvas-desk.png` });
  await masking.evaluate(element => element.remove());
  const cameraPositions: Record<string, string | null> = {};
  for (const id of ['role-1','role-2','project-1','project-2','project-3','project-4','project-5','project-6','project-7']) {
    await page.evaluate(anchor => { location.hash = anchor; }, id);
    await expect(page.locator('canvas')).toHaveAttribute('data-station', id, { timeout: 10000 });
    cameraPositions[id] = await page.locator('canvas').getAttribute('data-camera');
  }
  const maskingAfter = await page.addStyleTag({ content: '.masthead,.hero-copy,.section-inner,.next-section,.scene-controls,.footer { visibility: hidden !important; }' });
  const after = await page.locator('canvas').screenshot({ path: `${evidence}/canvas-project.png` });
  await maskingAfter.evaluate(element => element.remove());
  expect(before.equals(after)).toBe(false);
  writeFileSync(`${evidence}/camera-stations.json`, JSON.stringify(cameraPositions, null, 2));
  await page.getByRole('button', { name: 'Pause scene' }).click();
  await expect(page.locator('.scene-layer')).toHaveAttribute('data-running', 'false');
  await page.getByRole('button', { name: 'Resume scene' }).click();
  await expect(page.locator('.scene-layer')).toHaveAttribute('data-running', 'true');
  expect(errors).toEqual([]);
});

for (const mode of ['reduced-motion', 'save-data', 'low-tier', 'no-webgl', 'import-failure'] as const) {
  test(`${mode} keeps content and avoids or handles graphics download`, async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => requests.push(request.url()));
    if (mode === 'reduced-motion') await page.emulateMedia({ reducedMotion: 'reduce' });
    if (mode === 'save-data') await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true } }));
    if (mode === 'low-tier') await page.addInitScript(() => { Object.defineProperty(navigator, 'hardwareConcurrency', { value: 2 }); Object.defineProperty(navigator, 'maxTouchPoints', { value: 5 }); });
    if (mode === 'no-webgl') await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', { value: function (this: HTMLCanvasElement, name: string, ...args: unknown[]) { return name.startsWith('webgl') ? null : Reflect.apply(original, this, [name, ...args]); } });
    });
    if (mode === 'import-failure') await page.route('**/assets/Scene-*.js', route => route.abort());
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true');
    await parity(page);
    if (mode === 'import-failure') await expect(page.getByRole('button', { name: 'Retry 3D' })).toBeVisible({ timeout: 20000 });
    else expect(requests.filter(url => /\/Scene-[^/]+\.js/.test(url))).toEqual([]);
    await expect(page.locator('canvas')).toHaveCount(0);
    await page.screenshot({ path: `${evidence}/${mode}.png` });
  });
}

test('native deep links, history, keyboard and context loss', async ({ page }) => {
  await page.goto('./#project-6');
  await expect(page.locator('#project-6')).toBeInViewport();
  await page.getByRole('navigation', { name: 'Portfolio sections' }).getByRole('link', { name: 'Skills' }).click();
  await expect(page).toHaveURL(/#skills$/);
  await page.goBack();
  await expect(page).toHaveURL(/#project-6$/);
  await expect(page.locator('canvas')).toBeVisible({ timeout: 30000 });
  await page.locator('canvas').evaluate(canvas => { const context = (canvas as HTMLCanvasElement).getContext('webgl2'); context?.getExtension('WEBGL_lose_context')?.loseContext(); });
  await expect(page.locator('canvas')).toHaveCount(0);
  await parity(page);
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('A4 and Letter PDFs retain text and external destinations with and without JS', async ({ browser }) => {
  for (const javaScriptEnabled of [true, false]) {
    const context = await browser.newContext({ javaScriptEnabled, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(previewUrl);
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(() => document.fonts.ready);
    for (const format of ['A4', 'Letter'] as const) {
      await page.pdf({ path: `${evidence}/${javaScriptEnabled ? 'js' : 'nojs'}-${format}.pdf`, format, printBackground: false, displayHeaderFooter: false });
    }
    await context.close();
  }
  const graphicsContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const graphicsPage = await graphicsContext.newPage();
  await graphicsPage.goto(previewUrl);
  await expect(graphicsPage.locator('html')).toHaveClass(/graphics-on/);
  for (const format of ['A4', 'Letter'] as const) await graphicsPage.pdf({ path: `${evidence}/graphics-${format}.pdf`, format, displayHeaderFooter: false });
  await graphicsContext.close();
});

test('resume opens the exact shared PDF without JavaScript', async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(previewUrl);
  const resume = page.getByRole('link', { name: 'Resume', exact: true });
  await expect(resume).toBeVisible();
  await expect(resume).toHaveAttribute('href', '/portfolio/resume.pdf');
  const response = await request.get(await resume.getAttribute('href') ?? '');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
  const body = await response.body();
  expect(body.subarray(0, 5).toString()).toBe('%PDF-');
  expect(body.equals(readFileSync(resolve('public/resume.pdf')))).toBe(true);
  await context.close();
});

test('production assets, public link allowlist, privacy and real font loading', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('response', response => { if (response.url().startsWith(previewUrl) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('./');
  await page.evaluate(() => document.fonts.ready);
  const fontFamilies = await page.evaluate(() => [...document.fonts].filter(font => font.status === 'loaded').map(font => font.family));
  expect(fontFamilies.join(' ')).toContain('Source Sans 3');
  expect(fontFamilies.join(' ')).toContain('Space Grotesk');
  const links = await page.locator('a').evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href') ?? ''));
  for (const link of links) {
    if (link.startsWith('#')) await expect(page.locator(`[id="${link.slice(1)}"]`)).toHaveCount(1);
    else expect([...source.links, '/portfolio/licenses/THIRD-PARTY.txt']).toContain(link);
  }
  const html = await page.content();
  for (const pattern of [/Bhawana_Sahu_Resume\.pdf/i, /\.atlassian\.net/i, /XSI-\d+/i, /\.cline_storage/i, /canonical/i, /googletagmanager/i]) expect(html).not.toMatch(pattern);
  for (const asset of ['/portfolio/fonts/desk-display.typeface.json', '/portfolio/licenses/THIRD-PARTY.txt', '/portfolio/licenses/reference-MIT.txt', '/portfolio/licenses/Space-Grotesk-OFL.txt', '/portfolio/licenses/dependency-notices.txt']) {
    const response = await request.get(asset);
    expect(response.status(), asset).toBe(200);
    expect((await response.body()).length).toBeGreaterThan(20);
  }
  const runtimeAssets = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name).filter(url => /\.(woff2?|js|css)(\?|$)/.test(url)));
  for (const asset of runtimeAssets) { expect(asset).toContain('/portfolio/'); const response = await request.get(asset); expect(response.status()).toBe(200); expect(response.headers()['content-type']).not.toContain('text/html'); }
  expect(errors).toEqual([]);
  writeFileSync(`${evidence}/assets-privacy.json`, JSON.stringify({ links, fontFamilies, runtimeAssets, errors }, null, 2));
});