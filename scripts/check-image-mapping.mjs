import { readdirSync, readFileSync } from 'node:fs';

const files = readdirSync('public/photos/').sort();
const ts = readFileSync('src/data/products.ts', 'utf8');

// Extract all image URLs from products.ts
const urlMatches = [...ts.matchAll(/"image":\s*"([^"]+)"/g)];
const urls = urlMatches.map(m => m[1]);

console.log('Image URLs in products.ts (' + urls.length + ' total):');
urls.slice(0, 3).forEach(u => console.log('  ' + u));
console.log('  ...\n');

console.log('Verifying each URL maps to an existing file:');
let allMatch = true;
urls.forEach(url => {
  const filename = url.split('/').pop(); // e.g. "premium-gold-tea.png"
  if (files.includes(filename)) {
    console.log('  ✓ ' + url + ' -> ' + filename);
  } else {
    console.log('  ✗ ' + url + ' -> FILE NOT FOUND: ' + filename);
    allMatch = false;
  }
});

console.log(allMatch
  ? '\n✅ All ' + urls.length + ' image URLs resolve to real files on disk.'
  : '\n❌ Some image URLs do not match files on disk. See above.');
