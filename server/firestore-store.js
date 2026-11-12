// server/firestore-store.js
// Google Cloud Firestore backend for the store data (products, orders, leads,
// users, sessions) + Google Cloud Storage for product photos uploaded in Admin.
//
// Selected by server/admin-store.js when ADMIN_STORE=firestore (or automatically
// on Google Cloud Run). Same functions and return shapes as the Supabase and
// local-file backends, so the rest of the site does not care which one is used.
//
// Credentials: on Google Cloud Run nothing is needed - the service account of the
// Cloud Run service is used automatically. Locally, either run the Firestore
// emulator (FIRESTORE_EMULATOR_HOST=127.0.0.1:8085) or set
// GOOGLE_APPLICATION_CREDENTIALS to a service-account key file.
//
// Environment variables:
//   FIRESTORE_PROJECT_ID    Google Cloud project id (optional on Cloud Run)
//   FIRESTORE_DATABASE_ID   Firestore database id (optional, default "(default)")
//   GCS_BUCKET              Cloud Storage bucket for Admin photo uploads (must be public-read)

import { readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const productsJson = join(resolve(here, '..'), 'src/data/products.generated.json');

const COL = { products: 'products', orders: 'orders', leads: 'leads', users: 'users', sessions: 'sessions' };

let dbPromise = null;
function db() {
  if (!dbPromise) {
    dbPromise = import('@google-cloud/firestore').then(({ Firestore }) => {
      const projectId = process.env.FIRESTORE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || undefined;
      const databaseId = process.env.FIRESTORE_DATABASE_ID || undefined;
      return new Firestore({ projectId, databaseId, ignoreUndefinedProperties: true });
    });
  }
  return dbPromise;
}

const now = () => new Date().toISOString();
const newId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
async function seedProductsIfEmpty(d) {
  const snap = await d.collection(COL.products).limit(1).get();
  if (!snap.empty) return false;
  let list = [];
  try {
    list = JSON.parse(readFileSync(productsJson, 'utf8'));
  } catch {
    return false;
  }
  const batch = d.batch();
  list.forEach((p, i) => {
    batch.set(d.collection(COL.products).doc(p.id), {
      ...p,
      hidden: !!p.hidden,
      sortIndex: Number(p.sortIndex ?? i + 1) || 0,
      updatedAt: now(),
    });
  });
  await batch.commit();
  console.log(`[firestore] seeded ${list.length} products from products.generated.json`);
  return true;
}

export async function listProducts() {
  const d = await db();
  await seedProductsIfEmpty(d);
  const snap = await d.collection(COL.products).get();
  return snap.docs
    .map((doc) => doc.data())
    .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0) || String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
    .map(({ updatedAt, ...p }) => ({ ...p, hidden: !!p.hidden, sortIndex: p.sortIndex ?? 0 }));
}

export async function upsertProduct(product) {
  if (!product || !product.id || !product.name) throw new Error('Product id and name are required');
  const d = await db();
  await d.collection(COL.products).doc(String(product.id)).set(
    { ...product, hidden: !!product.hidden, sortIndex: Number(product.sortIndex) || 0, updatedAt: now() },
    { merge: true }
  );
  return true;
}

export async function deleteProduct(id) {
  if (!id) throw new Error('Product id required');
  const d = await db();
  await d.collection(COL.products).doc(String(id)).delete();
  return true;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
export async function addOrder(order) {
  const d = await db();
  const id = newId('order');
  await d.collection(COL.orders).doc(id).set({
    status: 'New',
    created_at: now(),
    ...order,
    id,
    customerEmail: String(order?.customer?.email || '').trim().toLowerCase(),
  });
  return true;
}

export async function listOrders() {
  const d = await db();
  const snap = await d.collection(COL.orders).orderBy('created_at', 'desc').limit(200).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function listOrdersByEmail(email) {
  const e = String(email || '').trim().toLowerCase();
  if (!e) return [];
  const d = await db();
  const snap = await d.collection(COL.orders).where('customerEmail', '==', e).get();
  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
    .slice(0, 100);
}

export async function updateOrderStatus(id, status) {
  if (!id || !status) throw new Error('Order id and status are required');
  const d = await db();
  const ref = d.collection(COL.orders).doc(String(id));
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.update({ status, updated_at: now() });
  return true;
}

// ---------------------------------------------------------------------------
// Leads (retailer applications, contact messages, newsletter)
// ---------------------------------------------------------------------------
export async function addLead(data) {
  const d = await db();
  const id = newId('lead');
  await d.collection(COL.leads).doc(id).set({ id, created_at: now(), data });
  return true;
}

export async function listLeads() {
  const d = await db();
  const snap = await d.collection(COL.leads).orderBy('created_at', 'desc').limit(200).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// ---------------------------------------------------------------------------
// Product photo uploads → Google Cloud Storage
// ---------------------------------------------------------------------------
let storagePromise = null;
export async function saveUpload({ name, contentType, buffer }) {
  const bucketName = process.env.GCS_BUCKET || '';
  if (!bucketName) {
    throw new Error('Photo upload needs GCS_BUCKET (a public Google Cloud Storage bucket). See GOOGLE-CLOUD-GUIDE.md.');
  }
  if (!storagePromise) {
    storagePromise = import('@google-cloud/storage').then(({ Storage }) => new Storage({
      projectId: process.env.FIRESTORE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || undefined,
    }));
  }
  const storage = await storagePromise;
  const objectName = `product-images/${name}`;
  await storage.bucket(bucketName).file(objectName).save(buffer, {
    resumable: false,
    contentType: contentType || 'image/jpeg',
    metadata: { cacheControl: 'public, max-age=31536000' },
  });
  return `https://storage.googleapis.com/${bucketName}/${objectName.split('/').map(encodeURIComponent).join('/')}`;
}

// ---------------------------------------------------------------------------
// Users & sessions
// ---------------------------------------------------------------------------
const toUser = (doc) => {
  if (!doc || !doc.exists) return null;
  const u = doc.data();
  return {
    id: doc.id,
    email: u.email,
    passwordHash: u.passwordHash,
    name: u.name,
    phone: u.phone,
    role: u.role,
    status: u.status,
    retailer: u.retailer || null,
    createdAt: u.createdAt,
  };
};

export async function createUser({ email, passwordHash, name, phone, role, status, retailer }) {
  const d = await db();
  const id = newId('user');
  const user = { email, passwordHash, name, phone, role, status, retailer: retailer || null, createdAt: now() };
  await d.collection(COL.users).doc(id).set(user);
  return { id, ...user };
}

export async function findUserByEmail(email) {
  const d = await db();
  const snap = await d.collection(COL.users).where('email', '==', email).limit(1).get();
  return snap.empty ? null : toUser(snap.docs[0]);
}

export async function findUserById(id) {
  if (!id) return null;
  const d = await db();
  return toUser(await d.collection(COL.users).doc(String(id)).get());
}

export async function listRetailers() {
  const d = await db();
  const snap = await d.collection(COL.users).where('role', '==', 'RETAILER').get();
  return snap.docs.map(toUser).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export async function updateUserStatus(id, status) {
  const d = await db();
  const ref = d.collection(COL.users).doc(String(id));
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.update({ status, updatedAt: now() });
  return true;
}

export async function createSession({ token, userId, expiresAt }) {
  const d = await db();
  await d.collection(COL.sessions).doc(token).set({ userId, expiresAt, createdAt: now() });
}

export async function getSession(token) {
  if (!token) return null;
  const d = await db();
  const snap = await d.collection(COL.sessions).doc(String(token)).get();
  if (!snap.exists) return null;
  const s = snap.data();
  if (new Date(s.expiresAt) <= new Date()) return null;
  return { token, userId: s.userId, expiresAt: s.expiresAt };
}

export async function deleteSession(token) {
  if (!token) return;
  const d = await db();
  await d.collection(COL.sessions).doc(String(token)).delete();
}
