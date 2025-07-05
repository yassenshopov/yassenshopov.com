const fs = require('fs');
const path = require('path');

const tsFile = path.join(__dirname, '../src/data/library.ts');
const outDir = path.join(__dirname, '../src/data/library');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const file = fs.readFileSync(tsFile, 'utf-8');
const arrMatch = file.match(/export const libraryItems: LibraryItem\[\] = \[(.*?)]\s*;/s);
if (!arrMatch) throw new Error('Could not find libraryItems array');
let arrText = arrMatch[1];

// Remove comments
arrText = arrText.replace(/\/\/.*$/gm, '');
// Remove trailing commas
arrText = arrText.replace(/,\s*([}\]])/g, '$1');
// Convert single to double quotes (for JSON)
arrText = arrText.replace(/'(.*?)'/g, (m, p1) => '"' + p1.replace(/\\"/g, '"') + '"');

// Wrap in array brackets
arrText = '[' + arrText.trim() + ']';

let items;
try {
  items = eval(arrText);
} catch (e) {
  console.error('Failed to parse items:', e);
  process.exit(1);
}

items.forEach(item => {
  const id = item.id || Math.random().toString(36).slice(2);
  const outFile = path.join(outDir, `${id}.json`);
  fs.writeFileSync(outFile, JSON.stringify(item, null, 2), 'utf-8');
  console.log('Wrote', outFile);
});

console.log('Done!'); 