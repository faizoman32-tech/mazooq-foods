// scripts/dump-catalog.mjs
// Helper to read server/catalog.js and dump it as JSON for inspection.
import { CATALOG } from '../server/catalog.js';
console.log(JSON.stringify(CATALOG, null, 2));
