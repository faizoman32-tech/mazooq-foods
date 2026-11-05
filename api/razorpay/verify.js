// api/razorpay/verify.js - Vercel serverless function
// Verifies the Razorpay payment signature and cross-checks the payment entity.
// User-aware: APPROVED retailers get quantity-tier wholesale pricing.
import {
  computeOrderTotal,
  fetchRazorpayPayment,
  notifyOrder,
  verifyPaymentSignature,
} from '../../server/payments-core.js';
import { addOrder } from '../../server/admin-store.js';
import { getUserBySession, parseCookieHeader, SESSION_COOKIE } from '../../server/auth-service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customer, items } = req.body || {};

    if (!verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    })) {
      return res.status(400).json({ ok: false, error: 'signature_mismatch' });
    }

    const payment = await fetchRazorpayPayment(razorpay_payment_id);
    if (payment) {
      if (payment.order_id && payment.order_id !== razorpay_order_id) {
        return res.status(400).json({ ok: false, error: 'order_mismatch' });
      }
      if (payment.status && !['captured', 'authorized'].includes(payment.status)) {
        return res.status(400).json({ ok: false, error: 'not_captured', status: payment.status });
      }
    }

    const token = parseCookieHeader(req.headers.cookie)[SESSION_COOKIE];
    const user = token ? await getUserBySession(token) : null;
    let totals = null;
    try { totals = computeOrderTotal(items, { user }); } catch { /* items optional here */ }
    await addOrder({
      receipt: payment?.notes?.receipt || null,
      type: 'ONLINE_PAYMENT',
      customer: customer || null,
      items: totals?.items || null,
      totals: totals ? { subtotal: totals.subtotal, shipping: totals.shipping, total: totals.total } : null,
      payment: { orderId: razorpay_order_id, paymentId: razorpay_payment_id, status: payment?.status || 'verified' },
      userId: user?.id || null,
      orderRole: totals?.isRetailerOrder ? 'RETAILER' : 'CUSTOMER',
    }).catch((e) => console.warn('[admin-store] order save failed:', e?.message));
    await notifyOrder({
      type: 'ONLINE_PAYMENT',
      receipt: payment?.notes?.receipt || null,
      customer: customer || null,
      items: totals?.items || null,
      totals: totals ? { subtotal: totals.subtotal, shipping: totals.shipping, total: totals.total } : null,
      razorpay: { orderId: razorpay_order_id, paymentId: razorpay_payment_id, status: payment?.status || 'verified' },
      paidAt: new Date().toISOString(),
      orderRole: totals?.isRetailerOrder ? 'RETAILER' : 'CUSTOMER',
    });

    res.json({
      ok: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      receipt: payment?.notes?.receipt || null,
      amount: payment?.amount ? payment.amount / 100 : totals?.total,
      status: payment?.status || 'verified',
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.code || 'error', message: e?.message || 'Unexpected error' });
  }
}
