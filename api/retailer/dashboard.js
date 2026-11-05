// api/retailer/dashboard.js - Vercel serverless function
// Retailer dashboard aggregate: account info + recent orders scoped to the retailer's email.
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
      return res.status(401).json({ ok: false, error: 'unauthorized', message: 'Please log in to continue.' });
    }
    if (user.role !== 'RETAILER' || user.status !== 'APPROVED') {
      return res.status(403).json({
        ok: false,
        error: 'forbidden',
        message: 'Approved retailer access only.',
        status: user.status,
      });
    }
    const orders = await listOrdersByEmail(user.email);
    res.json({
      ok: true,
      account: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        retailer: user.retailer || null,
        createdAt: user.createdAt,
      },
      orders: (orders || []).slice(0, 50),
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.code || 'error', message: e?.message || 'Unexpected error' });
  }
}
