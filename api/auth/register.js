// api/auth/register.js - Vercel serverless function
// Customer registration -> creates account + starts a session.
import {
  createSessionForUserId,
  registerCustomer,
  retailerError,
  sessionCookieHeader,
} from '../../server/auth-service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  try {
    const user = await registerCustomer(req.body || {});
    const token = await createSessionForUserId(user.id);
    res.setHeader('Set-Cookie', sessionCookieHeader(token, { secure: true }));
    res.json({ ok: true, user });
  } catch (e) {
    retailerError(res, e);
  }
}
