import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const sourceRoot = process.env.PORTFOLIO_SOURCE_ROOT ?? resolve('../..');
const evidence = resolve(sourceRoot, '.azure/validation/react');
const source = JSON.parse(await readFile(resolve(sourceRoot, '.azure/validation/react-source-inventory.json'), 'utf8'));
const normalize = text => text.replace(/\s+/g, '').replaceAll('\u00ad', '');
const results = [];
for (const name of (await readdir(evidence)).filter(name => name.endsWith('.pdf'))) {
  const document = await getDocument({ data: new Uint8Array(await readFile(resolve(evidence, name))), useSystemFonts: true }).promise;
  let fullText = '';
  const links = [];
  const pageResults = [];
  const overview = createCanvas(800, Math.ceil(document.numPages / 2) * 580);
  const overviewContext = overview.getContext('2d');
  overviewContext.fillStyle = '#d0d0d0'; overviewContext.fillRect(0, 0, overview.width, overview.height);
  for (let index = 1; index <= document.numPages; index++) {
    const page = await document.getPage(index);
    const text = await page.getTextContent();
    const strings = text.items.filter(item => 'str' in item);
    const pageText = strings.map(item => item.str).join(' ');
    assert.ok(pageText.trim().length > 30, `${name} blank page ${index}`);
    fullText += ` ${pageText}`;
    links.push(...(await page.getAnnotations()).map(annotation => annotation.url).filter(Boolean));
    const viewport = page.getViewport({ scale: 1 });
    const clipped = strings.filter(item => item.str.trim() && (item.transform[4] < -1 || item.transform[4] + item.width > viewport.width + 1 || item.transform[5] < 0 || item.transform[5] > viewport.height));
    assert.equal(clipped.length, 0, `${name} clipped text page ${index}`);
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    const raster = canvas.toBuffer('image/png');
    await writeFile(resolve(evidence, `${name}-${index}.png`), raster);
    overviewContext.drawImage(canvas, (index - 1) % 2 * 400, Math.floor((index - 1) / 2) * 580, 400, 560);
    pageResults.push({ page: index, characters: pageText.length, clipped: clipped.length });
  }
  for (const block of source.blocks) assert.ok(normalize(fullText).includes(normalize(block)), `${name} missing ${block}`);
  for (const link of source.links.filter(link => /^(https:|mailto:)/.test(link))) assert.ok(links.some(found => decodeURI(found).replace(/\/$/, '') === link.replace(/\/$/, '')), `${name} missing link ${link}`);
  await writeFile(resolve(evidence, `${name}.txt`), fullText);
  await writeFile(resolve(evidence, `${name}-overview.png`), overview.toBuffer('image/png'));
  results.push({ name, pages: document.numPages, blocks: source.blocks.length, links, pageResults });
  await document.destroy();
}
for (const name of ['canvas-desk.png', 'canvas-project.png']) {
  const image = await loadImage(resolve(evidence, name));
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, image.width, image.height).data;
  const colors = new Set(); let bright = 0;
  for (let index = 0; index < pixels.length; index += 16) { colors.add(`${pixels[index] >> 4},${pixels[index + 1] >> 4},${pixels[index + 2] >> 4}`); if (pixels[index] + pixels[index + 1] + pixels[index + 2] > 240) bright++; }
  assert.ok(colors.size > 35 && bright > 500, `${name} blank or featureless canvas`);
  results.push({ name, quantizedColors: colors.size, brightSamples: bright });
}
await writeFile(resolve(evidence, 'print-canvas-audit.json'), JSON.stringify(results, null, 2));
console.log('PASS: all PDF text/link inventories, page bounds, rasters and canvas variation checks');