// api/auth/me.js - Vercel serverless function
import { getUserBySession, parseCookieHeader, SESSION_COOKIE } from '../../server/auth-service.js';

export default async function handler(req, res) {
  try {
    const token = parseCookieHeader(req.headers.cookie)[SESSION_COOKIE];
    const user = token ? await getUserBySession(token) : null;
    res.json({ ok: true, user: user || null });
  } catch {
    res.json({ ok: true, user: null });
  }
}
