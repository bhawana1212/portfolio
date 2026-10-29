import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/portfolio/',
  plugins: [react(), {
    name: 'private-build-inventory',
    generateBundle(_, bundle) {
      const modules = Object.values(bundle).filter(output => output.type === 'chunk').flatMap(chunk => Object.entries(chunk.modules).filter(([, info]) => info.renderedLength > 0).map(([name]) => name.replaceAll('\\', '/')));
      const folder = resolve(process.env.PORTFOLIO_SOURCE_ROOT ?? '../..', '.azure/validation');
      mkdirSync(folder, { recursive: true });
      writeFileSync(resolve(folder, 'react-rendered-modules.json'), JSON.stringify(modules, null, 2));
    },
  }],
  server: { host: true, allowedHosts: true, strictPort: false },
  build: { outDir: 'dist', emptyOutDir: true },
});