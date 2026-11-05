// server/admin-store.js
// Data storage layer for the Admin Panel.
//
// Two backends:
//   1. Supabase (production)  - when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set.
//   2. Local file (development) - data/admin-store.json. Used automatically when Supabase
//      is not configured, or when ADMIN_STORE=file. Great for local testing.
//
// All Supabase calls use the SERVICE ROLE key and must only ever run server-side.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, '..');
const dataDir = join(projectRoot, 'data');
const storeFile = join(dataDir, 'admin-store.json');
const uploadsDir = join(dataDir, 'uploads');
const productsJson = join(projectRoot, 'src/data/products.generated.json');

export function getSupabase() {
  const url = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (url && key && process.env.ADMIN_STORE !== 'file') return { url, key };
  return null;
}

export function storeMode() {
  return getSupabase() ? 'supabase' : 'file';
}

async function supa(query, options = {}) {
  const { url, key } = getSupabase();
  const res = await fetch(`${url}/rest/v1/${query}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    throw new Error(`Supabase error ${res.status}: ${typeof data === 'string' ? data.slice(0, 300) : JSON.stringify(data).slice(0, 300)}`);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Local file store
// ---------------------------------------------------------------------------
function loadFile() {
  try {
    if (existsSync(storeFile)) return JSON.parse(readFileSync(storeFile, 'utf8'));
  } catch { /* fall through */ }
  return { products: null, orders: [], leads: [], users: [], sessions: [] };
}

function saveFile(s) {
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(storeFile, JSON.stringify(s, null, 2), 'utf8');
}

function fileProducts(s) {
  if (s.products) return s.products;
  try {
    const list = JSON.parse(readFileSync(productsJson, 'utf8'));
    s.products = list;
    saveFile(s);
    return list;
  } catch {
    s.products = [];
    saveFile(s);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export async function listProducts() {
  if (getSupabase()) {
    const rows = await supa('products?select=*&order=sort_index.asc,updated_at.desc');
    return (rows || []).map((r) => ({
      ...(r.data || {}),
      hidden: !!r.is_hidden,
      sortIndex: r.sort_index ?? 0,
    }));
  }
  const s = loadFile();
  return fileProducts(s);
}

export async function upsertProduct(product) {
  if (!product || !product.id || !product.name) throw new Error('Product id and name are required');
  if (getSupabase()) {
    const { hidden, sortIndex, ...data } = product;
    const row = {
      id: product.id,
      data,
      sort_index: Number(sortIndex) || 0,
      is_hidden: !!hidden,
      updated_at: new Date().toISOString(),
    };
    await supa('products?on_conflict=id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify([row]),
    });
    return true;
  }
  const s = loadFile();
  const list = fileProducts(s);
  const idx = list.findIndex((p) => p.id === product.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...product };
  else list.push(product);
  s.products = list;
  saveFile(s);
  return true;
}

export async function deleteProduct(id) {
  if (!id) throw new Error('Product id required');
  if (getSupabase()) {
    await supa(`products?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
    return true;
  }
  const s = loadFile();
  s.products = fileProducts(s).filter((p) => p.id !== id);
  saveFile(s);
  return true;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
export async function addOrder(order) {
  if (getSupabase()) {
    const row = {
      receipt: order.receipt || null,
      type: order.type || 'ONLINE_PAYMENT',
      status: 'New',
      customer: order.customer || null,
      items: order.items || null,
      totals: order.totals || null,
      payment: order.payment || null,
      user_id: order.userId || null,
      order_role: order.orderRole || null,
    };
    await supa('orders', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify([row]),
    });
    return true;
  }
  const s = loadFile();
  s.orders.unshift({
    id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    status: 'New',
    created_at: new Date().toISOString(),
    ...order,
  });
  s.orders = s.orders.slice(0, 500);
  saveFile(s);
  return true;
}

export async function listOrders() {
  if (getSupabase()) {
    const rows = await supa('orders?select=*&order=created_at.desc&limit=200');
    return rows || [];
  }
  const s = loadFile();
  return s.orders || [];
}

/**
 * Returns orders whose customer.email matches the supplied email (case-insensitive).
 * Used by the "my orders" / retailer dashboard endpoints - scoped to the logged-in user.
 * @param {string} email
 */
export async function listOrdersByEmail(email) {
  const e = String(email || '').trim().toLowerCase();
  if (!e) return [];
  if (getSupabase()) {
    // PostgREST ILIKE with URL-encoded pattern
    const pattern = encodeURIComponent(`%${e}%`);
    const rows = await supa(
      `orders?customer->>email=ilike.${pattern}&order=created_at.desc&limit=100`
    );
    return rows || [];
  }
  const s = loadFile();
  return (s.orders || [])
    .filter((o) => String(o?.customer?.email || '').toLowerCase() === e)
    .reverse();
}

export async function updateOrderStatus(id, status) {
  if (!id || !status) throw new Error('Order id and status are required');
  if (getSupabase()) {
    await supa(`orders?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ status }),
    });
    return true;
  }
  const s = loadFile();
  const o = (s.orders || []).find((x) => x.id === id);
  if (o) { o.status = status; saveFile(s); }
  return Boolean(o);
}

// ---------------------------------------------------------------------------
// Retailer leads
// ---------------------------------------------------------------------------
export async function addLead(data) {
  if (getSupabase()) {
    await supa('leads', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify([{ data }]),
    });
    return true;
  }
  const s = loadFile();
  s.leads.unshift({ id: `lead_${Date.now()}`, created_at: new Date().toISOString(), data });
  s.leads = s.leads.slice(0, 500);
  saveFile(s);
  return true;
}

export async function listLeads() {
  if (getSupabase()) {
    const rows = await supa('leads?select=*&order=created_at.desc&limit=200');
    return rows || [];
  }
  const s = loadFile();
  return s.leads || [];
}

// ---------------------------------------------------------------------------
// Image uploads
// ---------------------------------------------------------------------------
export async function saveUpload({ filename, contentType, base64 }) {
  if (!filename || !base64) throw new Error('filename and base64 are required');
  const safe = String(filename).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').slice(-80);
  const name = `${Date.now()}-${safe || 'image.jpg'}`;
  const buffer = Buffer.from(base64, 'base64');
  if (buffer.length > 4 * 1024 * 1024) throw new Error('Image too large (max 4 MB)');

  const { url, key } = getSupabase() || {};
  if (url && key) {
    const res = await fetch(`${url}/storage/v1/object/product-images/${encodeURIComponent(name)}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': contentType || 'image/jpeg',
        'x-upsert': 'true',
      },
      body: buffer,
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`Upload failed (${res.status}): ${t.slice(0, 200)}. Make sure the "product-images" bucket exists and is public.`);
    }
    return `${url}/storage/v1/object/public/product-images/${encodeURIComponent(name)}`;
  }

  mkdirSync(uploadsDir, { recursive: true });
  writeFileSync(join(uploadsDir, name), buffer);
  return `/uploads/${name}`;
}

// ---------------------------------------------------------------------------
// Users & sessions (auth)
// ---------------------------------------------------------------------------
function mapUserRow(r) {
  return {
    id: r.id,
    email: r.email,
    passwordHash: r.password_hash,
    name: r.name,
    phone: r.phone,
    role: r.role,
    status: r.status,
    retailer: r.retailer || null,
    createdAt: r.created_at,
  };
}

export async function createUser({ email, passwordHash, name, phone, role, status, retailer }) {
  if (getSupabase()) {
    const rows = await supa('users', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify([{ email, password_hash: passwordHash, name, phone, role, status, retailer: retailer || null }]),
    });
    return mapUserRow(Array.isArray(rows) ? rows[0] : rows);
  }
  const s = loadFile();
  if (!s.users) s.users = [];
  const user = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    email, passwordHash, name, phone, role, status,
    retailer: retailer || null,
    createdAt: new Date().toISOString(),
  };
  s.users.push(user);
  saveFile(s);
  return user;
}

export async function findUserByEmail(email) {
  if (getSupabase()) {
    const rows = await supa(`users?email=eq.${encodeURIComponent(email)}&limit=1`);
    return rows && rows[0] ? mapUserRow(rows[0]) : null;
  }
  const s = loadFile();
  return (s.users || []).find((u) => u.email === email) || null;
}

export async function findUserById(id) {
  if (getSupabase()) {
    const rows = await supa(`users?id=eq.${encodeURIComponent(id)}&limit=1`);
    return rows && rows[0] ? mapUserRow(rows[0]) : null;
  }
  const s = loadFile();
  return (s.users || []).find((u) => u.id === id) || null;
}

export async function listRetailers() {
  if (getSupabase()) {
    const rows = await supa('users?role=eq.RETAILER&order=created_at.desc');
    return (rows || []).map(mapUserRow);
  }
  return (loadFile().users || []).filter((u) => u.role === 'RETAILER').reverse();
}

export async function updateUserStatus(id, status) {
  if (getSupabase()) {
    await supa(`users?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
    });
    return true;
  }
  const s = loadFile();
  const u = (s.users || []).find((x) => x.id === id);
  if (u) {
    u.status = status;
    saveFile(s);
  }
  return Boolean(u);
}

export async function createSession({ token, userId, expiresAt }) {
  if (getSupabase()) {
    await supa('sessions', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify([{ token, user_id: userId, expires_at: expiresAt }]),
    });
    return;
  }
  const s = loadFile();
  if (!s.sessions) s.sessions = [];
  s.sessions = s.sessions.filter((x) => new Date(x.expiresAt) > new Date());
  s.sessions.push({ token, userId, expiresAt });
  saveFile(s);
}

export async function getSession(token) {
  if (!token) return null;
  if (getSupabase()) {
    const rows = await supa(`sessions?token=eq.${encodeURIComponent(token)}&limit=1`);
    const r = rows && rows[0];
    if (!r) return null;
    if (new Date(r.expires_at) <= new Date()) return null;
    return { token: r.token, userId: r.user_id, expiresAt: r.expires_at };
  }
  const s = loadFile();
  const x = (s.sessions || []).find((y) => y.token === token);
  if (!x) return null;
  if (new Date(x.expiresAt) <= new Date()) return null;
  return x;
}

export async function deleteSession(token) {
  if (getSupabase()) {
    await supa(`sessions?token=eq.${encodeURIComponent(token)}`, { method: 'DELETE' });
    return;
  }
  const s = loadFile();
  s.sessions = (s.sessions || []).filter((x) => x.token !== token);
  saveFile(s);
}

// ---------------------------------------------------------------------------
// Deploy hook (publish changes)
// ---------------------------------------------------------------------------
export async function pingDeployHook() {
  const url = process.env.DEPLOY_HOOK_URL || '';
  if (!url) return { triggered: false, reason: 'DEPLOY_HOOK_URL not set' };
  try {
    await fetch(url, { method: 'POST' });
    return { triggered: true };
  } catch (e) {
    return { triggered: false, reason: e?.message || 'deploy hook failed' };
  }
}
