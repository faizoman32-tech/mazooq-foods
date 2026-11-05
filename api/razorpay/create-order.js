// api/razorpay/create-order.js - Vercel serverless function
// Creates a Razorpay order with a server-recomputed amount.
// User-aware: APPROVED retailers get quantity-tier wholesale pricing.
import {
  computeOrderTotal,
  createRazorpayOrder,
  generateReceipt,
} from '../../server/payments-core.js';
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
    const order = await createRazorpayOrder({
      amountInr: totals.total,
      receipt,
      notes: {
        receipt,
        customerName: customer?.name || user?.name || '',
        phone: customer?.phone || user?.phone || '',
        email: customer?.email || user?.email || '',
        address: [customer?.address, customer?.city, customer?.state, customer?.pincode]
          .filter(Boolean)
          .join(', '),
        orderType: totals.isRetailerOrder ? 'RETAILER' : 'CUSTOMER',
        userId: user?.id || '',
      },
    });
    res.json({ ok: true, receipt, ...order, totals });
  } catch (e) {
    const code = e?.code || 'error';
    const status =
      code === 'NOT_CONFIGURED' ? 501 :
      code === 'INVALID_ITEM' || code === 'EMPTY_CART' || code === 'BAD_AMOUNT' ? 400 :
      code === 'GATEWAY_ERROR' ? 502 : 500;
    res.status(status).json({ ok: false, error: code, message: e?.message || 'Unexpected error' });
  }
}
