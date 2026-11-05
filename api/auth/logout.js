// api/auth/logout.js - Vercel serverless function
import { clearCookieHeader, logout, parseCookieHeader, SESSION_COOKIE } from '../../server/auth-service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  try {
    const token = parseCookieHeader(req.headers.cookie)[SESSION_COOKIE];
    await logout(token);
  } catch { /* ignore */ }
  res.setHeader('Set-Cookie', clearCookieHeader());
  res.json({ ok: true });
}
