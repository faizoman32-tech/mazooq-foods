// server/auth-service.js
// Authentication & sessions for customers and retailers.
//
// - Passwords hashed with scrypt (Node built-in, no external deps)
// - Sessions: random token stored in a table; the browser gets an HttpOnly cookie
// - Roles: CUSTOMER | RETAILER (ADMIN uses the separate admin panel auth)
// - Retailer accounts start with status PENDING and need admin approval.

import crypto from 'node:crypto';
import * as store from './admin-store.js';

export const SESSION_COOKIE = 'mzq_session';
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days (seconds)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function err(code, message) {
  const e = new Error(message);
  e.code = code;
  return e;
}

// ---------------------------------------------------------------------------
// Password hashing (scrypt)
// ---------------------------------------------------------------------------
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password, stored) {
  try {
    const parts = String(stored).split('$');
    if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
    const calc = crypto.scryptSync(String(password), parts[1], 64).toString('hex');
    const a = Buffer.from(calc, 'hex');
    const b = Buffer.from(parts[2], 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Cookie helpers (shared by Express server and Vercel functions)
// ---------------------------------------------------------------------------
export function sessionCookieHeader(token, { secure = false } = {}) {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}${secure ? '; Secure' : ''}`;
}

export function clearCookieHeader() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function parseCookieHeader(header) {
  const out = {};
  for (const part of String(header || '').split(';')) {
    const i = part.indexOf('=');
    if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function isSecureRequest(req) {
  const proto = req.headers['x-forwarded-proto'];
  return proto === 'https' || Boolean(req.socket && req.socket.encrypted);
}

export function setSessionCookieOnResponse(res, req, token) {
  res.setHeader('Set-Cookie', sessionCookieHeader(token, { secure: isSecureRequest(req) }));
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export async function registerCustomer({ email, password, name, phone }) {
  const cleanEmail = normalizeEmail(email);
  if (!EMAIL_RE.test(cleanEmail)) throw err('INVALID_INPUT', 'Please provide a valid email address.');
  if (!password || String(password).length < 8) throw err('INVALID_INPUT', 'Password must be at least 8 characters.');
  if (!name || String(name).trim().length < 2) throw err('INVALID_INPUT', 'Please provide your name.');

  const existing = await store.findUserByEmail(cleanEmail);
  if (existing) throw err('EMAIL_TAKEN', 'This email is already registered. Try logging in instead.');

  const user = await store.createUser({
    email: cleanEmail,
    passwordHash: hashPassword(password),
    name: String(name).trim(),
    phone: String(phone || '').trim(),
    role: 'CUSTOMER',
    status: 'ACTIVE',
  });
  return publicUser(user);
}

export async function registerRetailer({ email, password, contactName, businessName, phone, gstin, city, businessType, interestProducts, notes }) {
  const cleanEmail = normalizeEmail(email);
  if (!EMAIL_RE.test(cleanEmail)) throw err('INVALID_INPUT', 'Please provide a valid email address.');
  if (!password || String(password).length < 8) throw err('INVALID_INPUT', 'Password must be at least 8 characters.');
  if (!businessName || String(businessName).trim().length < 2) throw err('INVALID_INPUT', 'Business name is required.');

  const existing = await store.findUserByEmail(cleanEmail);
  if (existing) throw err('EMAIL_TAKEN', 'This email is already registered. Retailer login try karein.');

  const user = await store.createUser({
    email: cleanEmail,
    passwordHash: hashPassword(password),
    name: String(contactName || '').trim(),
    phone: String(phone || '').trim(),
    role: 'RETAILER',
    status: 'PENDING', // admin approval required
    retailer: {
      businessName: String(businessName || '').trim(),
      gstin: String(gstin || '').trim(),
      city: String(city || '').trim(),
      businessType: String(businessType || '').trim(),
      interestProducts: String(interestProducts || '').trim(),
      notes: String(notes || '').trim(),
    },
  });
  return publicUser(user);
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------
export async function createSessionForUserId(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString();
  await store.createSession({ token, userId, expiresAt });
  return token;
}

export async function login({ email, password }) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || !password) throw err('INVALID_INPUT', 'Email and password are required.');

  const user = await store.findUserByEmail(cleanEmail);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw err('BAD_CREDENTIALS', 'Invalid email or password.');
  }
  if (user.status === 'SUSPENDED') {
    throw err('SUSPENDED', 'This account has been suspended. Contact info@mazooq.com.');
  }

  const token = await createSessionForUserId(user.id);
  return { token, user: publicUser(user) };
}

export async function getUserBySession(token) {
  if (!token) return null;
  const session = await store.getSession(token);
  if (!session) return null;
  const user = await store.findUserById(session.userId);
  return publicUser(user);
}

export async function logout(token) {
  if (token) await store.deleteSession(token);
}

// ---------------------------------------------------------------------------
// Role helpers
// ---------------------------------------------------------------------------
export function isApprovedRetailer(user) {
  return Boolean(user && user.role === 'RETAILER' && user.status === 'APPROVED');
}

export function retailerError(res, e) {
  const code = e?.code || 'error';
  const status =
    code === 'EMAIL_TAKEN' ? 409 :
    code === 'INVALID_INPUT' ? 400 :
    code === 'BAD_CREDENTIALS' || code === 'SUSPENDED' ? 401 : 500;
  res.status(status).json({ ok: false, error: code, message: e?.message || 'Unexpected error' });
}
