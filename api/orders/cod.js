// api/orders/cod.js - Vercel serverless function
// Captures a Cash-on-Delivery order (server-validated totals) and forwards it
// to ORDER_NOTIFY_WEBHOOK_URL when configured.
// User-aware: APPROVED retailers get quantity-tier wholesale pricing.
import { computeOrderTotal, generateReceipt, notifyOrder } from '../../server/payments-core.js';
import { addOrder } from '../../server/admin-store.js';
import { getUserBySession, parseCookieHeader, SESSION_COOKIE } from '../../server/auth-service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  try {
    const { items, customer } = req.body || {};
    const token = parseCookieHeader(req.headers.cookie)[SESSION_COOKIE];
    const user = token ? await getUserBySession(token) : null;
    const totals = computeOrderTotal(items, { user });
    const receipt = generateReceipt();
    await addOrder({
      receipt,
      type: 'COD_ORDER',
      customer: customer || null,
      items: totals.items,
      totals: { subtotal: totals.subtotal, shipping: totals.shipping, total: totals.total },
      payment: { method: 'cod' },
      userId: user?.id || null,
      orderRole: totals.isRetailerOrder ? 'RETAILER' : 'CUSTOMER',
    }).catch((e) => console.warn('[admin-store] order save failed:', e?.message));
    await notifyOrder({
      type: 'COD_ORDER',
      receipt,
      customer: customer || null,
      items: totals.items,
      totals: { subtotal: totals.subtotal, shipping: totals.shipping, total: totals.total },
      placedAt: new Date().toISOString(),
      orderRole: totals.isRetailerOrder ? 'RETAILER' : 'CUSTOMER',
    });
    res.json({ ok: true, receipt, totals });
  } catch (e) {
    const code = e?.code || 'error';
    const status = code === 'INVALID_ITEM' || code === 'EMPTY_CART' ? 400 : 500;
    res.status(status).json({ ok: false, error: code, message: e?.message || 'Unexpected error' });
  }
}
