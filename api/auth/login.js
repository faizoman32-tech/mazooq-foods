// api/auth/login.js - Vercel serverless function
import { login, retailerError, sessionCookieHeader } from '../../server/auth-service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  try {
    const { token, user } = await login(req.body || {});
    res.setHeader('Set-Cookie', sessionCookieHeader(token, { secure: true }));
    res.json({ ok: true, user });
  } catch (e) {
    retailerError(res, e);
  }
}
