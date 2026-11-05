// server/admin-auth.js
// Minimal admin session tokens (HMAC-signed, 12h expiry).
// The admin password itself never leaves the server; only a signed token is returned.

import crypto from 'node:crypto';

function secret() {
  return `${process.env.ADMIN_PASSWORD || ''}::mazooq-admin-v1::`;
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

export function checkAdminPassword(password) {
  if (!adminConfigured() || !password) return false;
  return safeEqual(password, process.env.ADMIN_PASSWORD);
}

export function signAdminToken() {
  const exp = Date.now() + 12 * 60 * 60 * 1000; // 12 hours
  const payload = `admin.${exp}`;
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token) {
  try {
    if (!adminConfigured()) return false;
    const parts = String(token || '').split('.');
    if (parts.length !== 3 || parts[0] !== 'admin') return false;
    const exp = Number(parts[1]);
    if (!exp || Date.now() > exp) return false;
    const expected = crypto.createHmac('sha256', secret()).update(`${parts[0]}.${parts[1]}`).digest('base64url');
    return safeEqual(expected, parts[2]);
  } catch {
    return false;
  }
}
