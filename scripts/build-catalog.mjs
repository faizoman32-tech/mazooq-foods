// scripts/build-catalog.mjs
// Regenerates server/catalog.js (server-side price list) from src/data/products.generated.json.
// Runs automatically as part of `npm run build`, or manually via `npm run catalog:build`.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const srcFile = resolve(here, '../src/data/products.generated.json');
const outFile = resolve(here, '../server/catalog.js');
mkdirSync(dirname(outFile), { recursive: true });

const products = JSON.parse(readFileSync(srcFile, 'utf8'));
if (!Array.isArray(products) || products.length === 0) {
  throw new Error('products.generated.json is empty or invalid - refusing to generate an empty catalog.');
}

const catalog = {};
for (const product of products) {
  const variants = {};
  for (const variant of product.variants || []) {
    variants[variant.size] = variant.price;
  }
  catalog[product.id] = {
    name: product.name,
    category: product.category,
    variants,
    // Optional retailer pricing tiers (admin-configured wholesale pricing).
    // Missing/empty array means "no retailer pricing" - retailers fall back
    // to the regular variant price.
    ...(Array.isArray(product.retailerPricing) && product.retailerPricing.length
      ? { retailerPricing: product.retailerPricing }
      : {}),
    // Pack size the tier prices are quoted for (other sizes scale proportionally).
    ...(product.retailerPricingSize ? { retailerPricingSize: product.retailerPricingSize } : {}),
  };
}

const banner =
  '// AUTO-GENERATED from src/data/products.generated.json by scripts/build-catalog.mjs\n' +
  '// DO NOT EDIT BY HAND - run `npm run catalog:build` after changing products/prices.\n';

writeFileSync(outFile, `${banner}export const CATALOG = ${JSON.stringify(catalog, null, 2)};\n`, 'utf8');
console.log(`✓ Catalog written: ${Object.keys(catalog).length} products -> server/catalog.js`);
