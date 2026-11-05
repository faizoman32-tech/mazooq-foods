// api/orders/me.js - Vercel serverless function
// Returns orders for the currently logged-in user (customer OR retailer), scoped by email.
import { listOrdersByEmail } from '../../server/admin-store.js';
import { getUserBySession, parseCookieHeader, SESSION_COOKIE } from '../../server/auth-service.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  try {
    const token = parseCookieHeader(req.headers.cookie)[SESSION_COOKIE];
    const user = token ? await getUserBySession(token) : null;
    if (!user) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }
    const orders = await listOrdersByEmail(user.email);
    res.json({ ok: true, orders });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.code || 'error', message: e?.message || 'Unexpected error' });
  }
}
