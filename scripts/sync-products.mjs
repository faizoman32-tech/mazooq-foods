// scripts/sync-products.mjs
// Refreshes src/data/products.generated.json BEFORE builds. Sources (in order):
//   0. Firestore         - when ADMIN_STORE=firestore or FIRESTORE_PROJECT_ID is set
//                          (read-only; skipped quietly if Google credentials aren't available).
//   1. Supabase          - when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are configured.
//   2. Local admin store - data/admin-store.json (file mode / local development).
//   3. products.ts       - fallback so a fresh checkout still builds cleanly.
//
// This is what makes Admin Panel changes flow into the (static) website:
// Admin saves -> database -> deploy hook triggers rebuild -> this script syncs -> site updated.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const target = resolve(root, 'src/data/products.generated.json');
const tsSource = resolve(root, 'src/data/products.ts');

function clean(list) {
  return list
    .filter((p) => p && p.id && p.name && !p.hidden)
    .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0))
    .map((p) => {
      const clone = { ...p };
      delete clone.hidden;
      delete clone.sortIndex;
      delete clone.__hidden;
      delete clone.__sortIndex;
      delete clone.__updatedAt;
      delete clone.updatedAt;
      return clone;
    });
}

async function fromFirestore() {
  const wanted = process.env.ADMIN_STORE === 'firestore' || (process.env.FIRESTORE_PROJECT_ID && process.env.ADMIN_STORE !== 'file');
  if (!wanted) return null;
  try {
    const { Firestore } = await import('@google-cloud/firestore');
    const db = new Firestore({
      projectId: process.env.FIRESTORE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || undefined,
      databaseId: process.env.FIRESTORE_DATABASE_ID || undefined,
    });
    const snap = await Promise.race([
      db.collection('products').get(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timed out after 20s')), 20000)),
    ]);
    await db.terminate().catch(() => {});
    const list = snap.docs.map((d) => d.data());
    return list.length ? clean(list) : null;
  } catch (e) {
    console.warn(`• Firestore not reachable at build time (${e?.message || 'error'}) - using local product data`);
    return null;
  }
}

async function fromSupabase() {
  const url = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return null;
  const res = await fetch(`${url}/rest/v1/products?select=*&order=sort_index.asc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
  const rows = await res.json();
  return clean(rows.map((r) => ({ ...(r.data || {}), hidden: r.is_hidden, sortIndex: r.sort_index })));
}

function fromFileStore() {
  const f = resolve(root, 'data/admin-store.json');
  if (!existsSync(f)) return null;
  try {
    const s = JSON.parse(readFileSync(f, 'utf8'));
    if (!Array.isArray(s.products) || !s.products.length) return null;
    return clean(s.products);
  } catch {
    return null;
  }
}

// Fallback: parse products.ts so a fresh checkout (no admin data yet) still
// produces a valid products.generated.json. Lightweight regex extract — we do
// NOT execute TypeScript; we just pull out the PRODUCTS array literal.
function fromTsSource() {
  if (!existsSync(tsSource)) return null;
  try {
    const src = readFileSync(tsSource, 'utf8');
    const m = src.match(/export const PRODUCTS[^=]*=\s*(\[[\s\S]*?\n\];)/);
    if (!m) return null;
    // Detect the IMG constant declaration in products.ts so we use the same
    // value (the source file may have switched it from the old Google-hosted
    // URL to a local /photos path — we must not hardcode either).
    const imgMatch = src.match(/const\s+IMG\s*=\s*(['"])([^'"]+)\1/);
    const IMG = imgMatch ? imgMatch[2] : '/photos';
    // eslint-disable-next-line no-eval
    const arr = eval(`(function(){const IMG=${JSON.stringify(IMG)};return ${m[1]};})()`);
    if (!Array.isArray(arr) || !arr.length) return null;
    return clean(arr);
  } catch (e) {
    console.warn(`• products.ts fallback parse failed: ${e?.message || 'error'}`);
    return null;
  }
}

try {
  const firestore = await fromFirestore();
  const supa = !firestore && !['file', 'firestore'].includes(process.env.ADMIN_STORE) ? await fromSupabase() : null;
  const products = firestore || supa || fromFileStore() || fromTsSource();
  if (products && products.length) {
    writeFileSync(target, JSON.stringify(products, null, 2) + '\n', 'utf8');
    console.log(`✓ products synced: ${products.length} (${firestore ? 'Firestore' : supa ? 'Supabase' : fromFileStore() ? 'local admin store' : 'products.ts fallback'})`);
  } else {
    console.log('• no admin data source configured - keeping existing products JSON');
  }
} catch (e) {
  console.warn(`• products sync skipped (${e?.message || 'error'}) - keeping existing JSON`);
}
