import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
try {
  const { render } = await server.ssrLoadModule('/src/content/render.tsx');
  const { html, css } = render();
  const filename = new URL('../dist/index.html', import.meta.url);
  const template = await readFile(filename, 'utf8');
  if (!template.includes('<!--app-html-->')) throw new Error('Prerender insertion point missing');
  await writeFile(filename, template.replace('<!--app-html-->', html).replace('<!--app-styles-->', css));
  await writeFile(new URL('../dist/.nojekyll', import.meta.url), '');
  console.log('Prerendered complete semantic portfolio into dist/index.html');
} finally {
  await server.close();
}