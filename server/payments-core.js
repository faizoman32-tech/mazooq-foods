// server/payments-core.js
// Shared Razorpay payment logic - used by BOTH:
//   - server.js (Express server on Render / VPS / local)
//   - api/razorpay/*.js (Vercel serverless functions)
//
// Security model:
//   1. All prices are recomputed server-side from server/catalog.js (never trust the client total).
//   2. Razorpay order is created with the server-computed amount.
//   3. Payment signature is verified with HMAC-SHA256 (timing-safe), then the payment
//      entity is fetched from Razorpay to double-check status + order + amount.
//   4. Retailer pricing: when the authenticated user is an APPROVED retailer, the
//      server computes the unit price from the product's `retailerPricing` tiers
//      based on cart quantity AND pack size (see shared/retailer-pricing.js). Customers always get the regular variant price.

import crypto from 'node:crypto';
import { CATALOG } from './catalog.js';
import { retailerUnitPrice } from '../shared/retailer-pricing.js';
import { emailNewOrder, emailRetailerApplication, emailContactMessage, emailConfigured } from './notify-email.js';

const API_BASE = process.env.RAZORPAY_API_BASE || 'https://api.razorpay.com/v1';

export function getConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  return { keyId, keySecret, webhookSecret, configured: Boolean(keyId && keySecret) };
}

function basicAuth(keyId, keySecret) {
  return 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
}

function err(code, message) {
  const e = new Error(message);
  e.code = code;
  return e;
}

/**
 * Public shape of the (extended) catalog entry. `retailerPricing` is optional -
 * admin-configured quantity-based wholesale pricing for approved retailers only.
 * @typedef {{ name: string, category: string, variants: Record<string, number>, retailerPricing?: Array<{minQty:number, maxQty:number|null, pricePerUnit:number}> }} CatalogEntry
 */

/** Matches a cart line to the server catalog. Accepts "500g" or "500g Heritage Pouch" style sizes. */
export function resolveLinePrice(productId, variantSize) {
  const product = CATALOG[productId];
  if (!product) return null;
  const variants = product.variants || {};
  if (typeof variantSize !== 'string') return null;
  if (variants[variantSize] !== undefined) {
    return { price: variants[variantSize], matchedSize: variantSize };
  }
  const raw = variantSize.trim().toLowerCase();
  for (const [size, price] of Object.entries(variants)) {
    const s = size.toLowerCase();
    if (raw === s || raw.startsWith(s) || raw.includes(s)) {
      return { price, matchedSize: size };
    }
  }
  return null;
}

/**
 * Recomputes the authoritative order total from catalog prices.
 *
 * @param {Array<{productId:string, variantSize:string, quantity:number}>} items
 * @param {object} opts
 * @param {{ role?: string, status?: string } | null} [opts.user]
 *   Authenticated user. When `role === 'RETAILER'` and `status === 'APPROVED'`,
 *   the server computes retailer-specific pricing.
 * @returns {{ subtotal:number, shipping:number, total:number, items:Array, isRetailerOrder:boolean }}
 */
export function computeOrderTotal(items, opts = {}) {
  if (!Array.isArray(items) || items.length === 0) {
    throw err('EMPTY_CART', 'Cart is empty');
  }
  const user = opts && opts.user ? opts.user : null;
  const isApprovedRetailer = Boolean(
    user && user.role === 'RETAILER' && user.status === 'APPROVED'
  );

  let subtotal = 0;
  const normalized = [];
  for (const it of items) {
    const qty = Math.max(1, Math.min(9999, Number(it?.quantity) || 1));
    const resolved = resolveLinePrice(it?.productId, it?.variantSize);
    if (!resolved) {
      throw err('INVALID_ITEM', `Unknown product or size: ${it?.productId} (${it?.variantSize})`);
    }
    // Pick the unit price: retailer tier price if applicable, else regular variant price.
    let unitPrice = resolved.price;
    if (isApprovedRetailer) {
      const retailerPrice = retailerUnitPrice(CATALOG[it.productId], resolved.matchedSize, qty);
      if (typeof retailerPrice === 'number' && retailerPrice > 0) {
        unitPrice = retailerPrice;
      }
    }
    subtotal += unitPrice * qty;
    normalized.push({
      productId: it.productId,
      name: CATALOG[it.productId].name,
      variantSize: resolved.matchedSize,
      price: unitPrice,
      quantity: qty,
      isRetailerPrice: isApprovedRetailer && unitPrice !== resolved.price,
    });
  }
  // Retailers ship free above ₹5,000 (wholesale threshold); else ₹199 flat.
  // Customers ship free above ₹1,500; else ₹99.
  let shipping;
  if (isApprovedRetailer) {
    shipping = subtotal >= 5000 ? 0 : 199;
  } else {
    shipping = subtotal >= 1500 ? 0 : 99;
  }
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    items: normalized,
    isRetailerOrder: isApprovedRetailer,
  };
}

/** Creates a real order on Razorpay (POST /v1/orders). Amount in INR, converted to paise. */
export async function createRazorpayOrder({ amountInr, receipt, notes }) {
  const { keyId, keySecret, configured } = getConfig();
  if (!configured) {
    throw err(
      'NOT_CONFIGURED',
      'Razorpay is not configured on the server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
    );
  }
  const amountPaise = Math.round(Number(amountInr) * 100);
  if (!Number.isFinite(amountPaise) || amountPaise < 100) {
    throw err('BAD_AMOUNT', 'Order amount must be at least INR 1.00');
  }

  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      Authorization: basicAuth(keyId, keySecret),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt: String(receipt || '').slice(0, 40),
      notes: notes || {},
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.id) {
    throw err(
      'GATEWAY_ERROR',
      data?.error?.description || `Razorpay order creation failed (${res.status})`
    );
  }
  return { keyId, orderId: data.id, amount: data.amount || amountPaise, currency: data.currency || 'INR' };
}

/** Verifies HMAC-SHA256 signature: HMAC(order_id + "|" + payment_id, key_secret) */
export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  const { keySecret } = getConfig();
  if (!keySecret || !orderId || !paymentId || !signature) return false;
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(String(signature), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Fetches the payment entity from Razorpay for the second validation layer. Returns null if unavailable. */
export async function fetchRazorpayPayment(paymentId) {
  const { keyId, keySecret, configured } = getConfig();
  if (!configured) return null;
  try {
    const res = await fetch(`${API_BASE}/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: basicAuth(keyId, keySecret) },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Verifies incoming webhook signature (header: x-razorpay-signature). */
export function verifyWebhookSignature(rawBody, signature) {
  const { webhookSecret } = getConfig();
  if (!webhookSecret || !signature || !rawBody) return false;
  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(String(signature), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Notifications for orders, retailer applications and contact messages:
 *   1. Email (Resend) - alert to you + confirmation to the customer. See server/notify-email.js.
 *   2. Optional webhook: if ORDER_NOTIFY_WEBHOOK_URL is set, the payload is also forwarded
 *      as JSON (e.g. Google Sheets Apps Script, Zapier, Make, n8n).
 * Failures are logged but never block the order.
 */
export async function notifyOrder(orderPayload) {
  const type = orderPayload && orderPayload.type;
  const emailTask =
    type === 'COD_ORDER' || type === 'ONLINE_PAYMENT'
      ? emailNewOrder(orderPayload)
      : type === 'RETAILER_APPLICATION'
        ? emailRetailerApplication(orderPayload.application)
        : type === 'CONTACT_MESSAGE'
          ? emailContactMessage(orderPayload.message)
          : Promise.resolve(null);

  const url = process.env.ORDER_NOTIFY_WEBHOOK_URL || '';
  const webhookTask = url
    ? fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })
        .then(() => true)
        .catch((e) => {
          console.error('[order-notify] Failed to forward order:', e?.message);
          return false;
        })
    : Promise.resolve(false);

  const [email, webhook] = await Promise.all([
    emailTask.catch((e) => {
      console.error('[order-notify] email failed:', e?.message);
      return null;
    }),
    webhookTask,
  ]);
  if (!url && !emailConfigured()) {
    console.log('[order-notify] No RESEND_API_KEY / ORDER_NOTIFY_WEBHOOK_URL set - logged only:');
    console.log(JSON.stringify(orderPayload));
  }
  return { sent: Boolean(webhook || (email && (email.sent || email.alertSent))), email, webhook };
}

export function generateReceipt() {
  return `MZQ-${Math.floor(100000 + Math.random() * 900000)}`;
}
