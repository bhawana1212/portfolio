import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import opentype from 'opentype.js';

const input = process.argv[2];
if (!input) throw new Error('Provide an audited Space Grotesk TTF or WOFF path');
const bytes = await readFile(input);
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const scale = 1000 / font.unitsPerEm;
const rounded = value => Math.round(value * scale);
const glyphs = {};
for (const character of new Set('Bhawana SahuROLEWK0123456789? ')) {
  const glyph = font.charToGlyph(character);
  const path = [];
  for (const command of glyph.path.commands) {
    if (command.type === 'M' || command.type === 'L') path.push(command.type.toLowerCase(), rounded(command.x), rounded(command.y));
    if (command.type === 'Q') path.push('q', rounded(command.x), rounded(command.y), rounded(command.x1), rounded(command.y1));
    if (command.type === 'C') path.push('b', rounded(command.x), rounded(command.y), rounded(command.x1), rounded(command.y1), rounded(command.x2), rounded(command.y2));
  }
  const bounds = glyph.getBoundingBox();
  glyphs[character] = { ha: rounded(glyph.advanceWidth ?? 0), x_min: rounded(bounds.x1), x_max: rounded(bounds.x2), o: path.join(' ') };
}
const typeface = { glyphs, familyName: 'Desk Display', ascender: rounded(font.ascender), descender: rounded(font.descender), underlinePosition: -100, underlineThickness: 50, boundingBox: { xMin: -200, xMax: 1400, yMin: -300, yMax: 1200 }, resolution: 1000, original_font_information: { license: 'SIL Open Font License 1.1', copyright: font.names.copyright?.en, sourceFamily: 'Space Grotesk', modifiedName: 'Desk Display' } };
await mkdir(resolve('public/fonts'), { recursive: true });
await writeFile(resolve('public/fonts/desk-display.typeface.json'), JSON.stringify(typeface));
console.log(`Generated OFL Desk Display subset: ${Object.keys(glyphs).length} glyphs`);