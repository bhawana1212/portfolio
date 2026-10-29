import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
const notices = [];
const missing = [];
const unshipped = [];
const renderedModules = JSON.parse(await readFile(resolve(process.env.PORTFOLIO_SOURCE_ROOT ?? '../..', '.azure/validation/react-rendered-modules.json'), 'utf8'));
for (const [location, metadata] of Object.entries(lock.packages)) {
  if (!location || metadata.dev || !location.startsWith('node_modules/')) continue;
  let files;
  try { files = await readdir(location); } catch { continue; }
  const name = metadata.name ?? location.split('node_modules/').at(-1);
  const licenses = files.filter(name => /^(licen[cs]e|copying|notice|ofl)(\.|$|-)/i.test(name));
  let text = '';
  for (const license of licenses) {
    try { text += `\n${license}\n${await readFile(resolve(location, license), 'utf8')}\n`; } catch { continue; }
  }
  if (!text) {
    try { text = await readFile(resolve('public/licenses/upstream', name.replaceAll('/', '__').replace('@', '') + '.txt'), 'utf8'); } catch {
      const shipped = renderedModules.some(module => module.includes(`/${location.replaceAll('\\', '/')}/`));
      if (shipped) missing.push(`${name}@${metadata.version}`);
      else unshipped.push(`${name}@${metadata.version}`);
    }
  }
  notices.push(`${name}@${metadata.version}\nDeclared license: ${metadata.license ?? 'see distribution'}\n${text}`);
}
await mkdir('public/licenses', { recursive: true });
await writeFile('public/licenses/dependency-notices.txt', notices.join('\n============================================================\n'));
await writeFile(resolve(process.env.PORTFOLIO_SOURCE_ROOT ?? '../..', '.azure/validation/react-license-audit.json'), JSON.stringify({ distributions: notices.length, missing, unshippedWithoutFullNotice: unshipped }, null, 2));
console.log(`Recorded ${notices.length} production distribution notices; missing notices: ${missing.join(', ') || 'none'}`);
if (missing.length) process.exitCode = 1;