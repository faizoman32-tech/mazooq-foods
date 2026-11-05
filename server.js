// server.js - production server for Mazooq Foods
// Serves the built Vite site (dist/) + payment APIs + Admin Panel APIs +
// retailer dashboard APIs. Used on Render / any VPS / local. On Vercel, the
// api/ folder is used instead.
//
// Local run:  npm run build && npm start   (or: node server.js)
// Admin:      http://localhost:8080/admin
// Port:       process.env.PORT || 8080

import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  computeOrderTotal,
  createRazorpayOrder,
  fetchRazorpayPayment,
  generateReceipt,
  getConfig,
  notifyOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
} from './server/payments-core.js';
import {
  addLead,
  addOrder,
  deleteProduct,
  listLeads,
  listOrders,
  listProducts,
  listRetailers,
  pingDeployHook,
  saveUpload,
  storeMode,
  updateOrderStatus,
  updateUserStatus,
  upsertProduct,
  listOrdersByEmail,
} from './server/admin-store.js';
import {
  clearCookieHeader,
  createSessionForUserId,
  getUserBySession,
  login as authLogin,
  logout as authLogout,
  parseCookieHeader,
  registerCustomer,
  registerRetailer,
  retailerError,
  SESSION_COOKIE,
  setSessionCookieOnResponse,
} from './server/auth-service.js';
import { submitContact, submitNewsletter, notifyRetailerSignup, formError } from './server/forms.js';
import { adminConfigured, checkAdminPassword, signAdminToken, verifyAdminToken } from './server/admin-auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

function sendError(res, e) {
  const code = e?.code || 'error';
  const status =
    code === 'NOT_CONFIGURED' ? 501 :
    code === 'INVALID_ITEM' || code === 'EMPTY_CART' || code === 'BAD_AMOUNT' ? 400 :
    code === 'GATEWAY_ERROR' ? 502 : 500;
  res.status(status).json({ ok: false, error: code, message: e?.message || 'Unexpected error' });
}

function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/, '');
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  next();
}

/**
 * Express middleware: requires an authenticated user (customer or retailer).
 * Returns 401 if not logged in. Attaches `req.user`.
 */
async function requireUser(req, res, next) {
  try {
    const token = parseCookieHeader(req.headers.cookie)[SESSION_COOKIE];
    const user = token ? await getUserBySession(token) : null;
    if (!user) {
      return res.status(401).json({ ok: false, error: 'unauthorized', message: 'Please log in to continue.' });
    }
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
}

/**
 * Express middleware: requires an APPROVED RETAILER. Customers and guests are
 * rejected with 403. PENDING/REJECTED/SUSPENDED retailers are also rejected
 * with a clear status code so the frontend can show a helpful message.
 */
function requireApprovedRetailer(req, res, next) {
  const user = req.user;
  if (!user || user.role !== 'RETAILER') {
    return res.status(403).json({ ok: false, error: 'forbidden', message: 'Retailer access only.' });
  }
  if (user.status !== 'APPROVED') {
    return res.status(403).json({
      ok: false,
      error: 'retailer_not_approved',
      message: `Retailer status: ${user.status}. Admin approval required.`,
      status: user.status,
    });
  }
  next();
}

// Helper: get the authenticated user from the session cookie, or null.
async function userFromReq(req) {
  try {
    const token = parseCookieHeader(req.headers.cookie)[SESSION_COOKIE];
    return token ? await getUserBySession(token) : null;
  } catch {
    return null;
  }
}

// --- Webhook FIRST so it receives the raw body (signature needs exact bytes) ---
app.post('/api/razorpay/webhook', express.raw({ type: '*/*' }), (req, res) => {
  const raw = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : '';
  const signature = req.headers['x-razorpay-signature'];
  if (!verifyWebhookSignature(raw, signature)) {
    return res.status(400).json({ ok: false, error: 'invalid_signature' });
  }
  let event = {};
  try { event = JSON.parse(raw); } catch { /* ignore */ }
  console.log('[razorpay-webhook]', event?.event || 'unknown-event');
  res.json({ ok: true });
});

app.use(express.json({ limit: '6mb' }));

// --- Health check ---
app.get('/api/health', (_req, res) => {
  const { configured } = getConfig();
  res.json({ ok: true, razorpay: configured ? 'configured' : 'not_configured', adminStore: storeMode() });
});

// ===========================================================================
// Catalog API (public, customer-facing). Prices are the regular retail prices.
// Retailer-specific pricing is only returned via /api/retailer/catalog (auth).
// ===========================================================================
app.get('/api/catalog', async (_req, res) => {
  try {
    const products = await listProducts();
    // Public catalog strips hidden products AND retailer pricing tiers.
    const publicProducts = (products || [])
      .filter((p) => p && !p.hidden)
      .map((p) => {
        const clone = { ...p };
        delete clone.hidden;
        delete clone.sortIndex;
        delete clone.retailerPricing;
        return clone;
      });
    res.json({ ok: true, products: publicProducts });
  } catch (e) {
    sendError(res, e);
  }
});

// --- Create Razorpay order (amount recomputed server-side, user-aware) ---
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { items, customer } = req.body || {};
    const user = await userFromReq(req);
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
    sendError(res, e);
  }
});

// --- Verify payment signature + cross-check with Razorpay ---
app.post('/api/razorpay/verify', async (req, res) => {
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

    const user = await userFromReq(req);
    let totals = null;
    try { totals = computeOrderTotal(items, { user }); } catch { /* items optional here */ }

    // Save the paid order for the Admin Panel (best-effort, never blocks the customer).
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
    sendError(res, e);
  }
});

// --- Cash on Delivery order capture ---
app.post('/api/orders/cod', async (req, res) => {
  try {
    const { items, customer } = req.body || {};
    const user = await userFromReq(req);
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
    sendError(res, e);
  }
});

// ===========================================================================
// Order history: my-orders (customer + retailer, scope-by-email)
// ===========================================================================
app.get('/api/orders/me', async (req, res) => {
  try {
    const user = await userFromReq(req);
    if (!user) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }
    // Look up by user email (covers both guest-checkout-with-email and logged-in users).
    const orders = await listOrdersByEmail(user.email);
    res.json({ ok: true, orders });
  } catch (e) {
    sendError(res, e);
  }
});

// --- Contact form + newsletter (saved as leads; contact messages are emailed) ---
app.post('/api/contact', async (req, res) => {
  try {
    res.json(await submitContact(req.body));
  } catch (e) {
    formError(res, e);
  }
});
app.post('/api/newsletter', async (req, res) => {
  try {
    res.json(await submitNewsletter(req.body));
  } catch (e) {
    formError(res, e);
  }
});

// --- Retailer / B2B application capture ---
app.post('/api/leads/retailer', async (req, res) => {
  try {
    const data = req.body || {};
    if (!data.businessName && !data.contactName && !data.phone) {
      return res.status(400).json({ ok: false, error: 'INVALID_INPUT', message: 'Business or contact details required' });
    }
    await addLead(data).catch((e) => console.warn('[admin-store] lead save failed:', e?.message));
    await notifyOrder({ type: 'RETAILER_APPLICATION', receivedAt: new Date().toISOString(), application: data });
    res.json({ ok: true, message: 'Application received' });
  } catch (e) {
    sendError(res, e);
  }
});

// ===========================================================================
// Auth: customers & retailers (HttpOnly cookie sessions)
// ===========================================================================
app.post('/api/auth/register', async (req, res) => {
  try {
    const user = await registerCustomer(req.body || {});
    const token = await createSessionForUserId(user.id);
    setSessionCookieOnResponse(res, req, token);
    res.json({ ok: true, user });
  } catch (e) {
    retailerError(res, e);
  }
});

app.post('/api/auth/retailer/register', async (req, res) => {
  try {
    const user = await registerRetailer(req.body || {});
    await notifyRetailerSignup(req.body).catch((e) => console.warn('[notify] retailer signup:', e?.message));
    res.json({ ok: true, user, message: 'Application received. Admin approval ke baad aap login kar payenge.' });
  } catch (e) {
    retailerError(res, e);
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { token, user } = await authLogin(req.body || {});
    setSessionCookieOnResponse(res, req, token);
    res.json({ ok: true, user });
  } catch (e) {
    retailerError(res, e);
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const token = parseCookieHeader(req.headers.cookie)[SESSION_COOKIE];
    await authLogout(token);
  } catch { /* ignore */ }
  res.setHeader('Set-Cookie', clearCookieHeader());
  res.json({ ok: true });
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const token = parseCookieHeader(req.headers.cookie)[SESSION_COOKIE];
    const user = token ? await getUserBySession(token) : null;
    res.json({ ok: true, user: user || null });
  } catch {
    res.json({ ok: true, user: null });
  }
});

// ===========================================================================
// Retailer-only APIs (require APPROVED retailer session)
// ===========================================================================

// Public catalog WITH retailer pricing tiers (only the pricing structure -
// the actual unit price is still computed server-side at checkout time).
app.get('/api/retailer/catalog', requireUser, requireApprovedRetailer, async (_req, res) => {
  try {
    const products = await listProducts();
    const retailerProducts = (products || [])
      .filter((p) => p && !p.hidden)
      .map((p) => {
        const clone = { ...p };
        delete clone.hidden;
        delete clone.sortIndex;
        // Keep retailerPricing so the retailer UI can show the tier table.
        return clone;
      });
    res.json({ ok: true, products: retailerProducts });
  } catch (e) {
    sendError(res, e);
  }
});

// Retailer dashboard aggregate: account info + recent orders.
app.get('/api/retailer/dashboard', requireUser, requireApprovedRetailer, async (req, res) => {
  try {
    const user = req.user;
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
    sendError(res, e);
  }
});

// ===========================================================================
// Admin Panel APIs
// ===========================================================================

// Status (public: only says whether admin/auth is configured)
app.get('/api/admin/status', (_req, res) => {
  res.json({ ok: true, adminConfigured: adminConfigured(), store: storeMode() });
});

// Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!adminConfigured()) {
    return res.status(501).json({ ok: false, error: 'not_configured', message: 'ADMIN_PASSWORD is not set on the server.' });
  }
  if (!checkAdminPassword(password)) {
    return res.status(401).json({ ok: false, error: 'bad_password', message: 'Incorrect password.' });
  }
  res.json({ ok: true, token: signAdminToken() });
});

// Products list
app.get('/api/admin/products', requireAdmin, async (_req, res) => {
  try {
    const products = await listProducts();
    res.json({ ok: true, products, store: storeMode() });
  } catch (e) {
    sendError(res, e);
  }
});

// Product upsert (+ delete via { action: 'delete', id })
app.post('/api/admin/products', requireAdmin, async (req, res) => {
  try {
    if (req.body?.action === 'delete') {
      await deleteProduct(req.body?.id);
      const deploy = await pingDeployHook();
      return res.json({ ok: true, deploy });
    }
    const product = req.body?.product;
    await upsertProduct(product);
    const deploy = await pingDeployHook();
    res.json({ ok: true, deploy });
  } catch (e) {
    sendError(res, e);
  }
});

// Product delete
app.post('/api/admin/products/delete', requireAdmin, async (req, res) => {
  try {
    const { id } = req.body || {};
    await deleteProduct(id);
    const deploy = await pingDeployHook();
    res.json({ ok: true, deploy });
  } catch (e) {
    sendError(res, e);
  }
});

// Orders
app.get('/api/admin/orders', requireAdmin, async (_req, res) => {
  try {
    const orders = await listOrders();
    res.json({ ok: true, orders });
  } catch (e) {
    sendError(res, e);
  }
});

app.post('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    const { id, status } = req.body || {};
    const allowed = ['New', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ ok: false, error: 'INVALID_STATUS' });
    }
    const updated = await updateOrderStatus(id, status);
    res.json({ ok: true, updated });
  } catch (e) {
    sendError(res, e);
  }
});

// Retailers (applications + approval workflow)
app.get('/api/admin/retailers', requireAdmin, async (_req, res) => {
  try {
    const retailers = await listRetailers();
    res.json({ ok: true, retailers });
  } catch (e) {
    sendError(res, e);
  }
});

app.post('/api/admin/retailers', requireAdmin, async (req, res) => {
  try {
    const { id, status } = req.body || {};
    const allowed = ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ ok: false, error: 'INVALID_STATUS' });
    }
    const updated = await updateUserStatus(id, status);
    res.json({ ok: true, updated });
  } catch (e) {
    sendError(res, e);
  }
});

// Retailer leads
app.get('/api/admin/leads', requireAdmin, async (_req, res) => {
  try {
    const leads = await listLeads();
    res.json({ ok: true, leads });
  } catch (e) {
    sendError(res, e);
  }
});

// Image upload (base64 JSON - max ~4 MB per image)
app.post('/api/admin/upload', requireAdmin, async (req, res) => {
  try {
    const { filename, contentType, base64 } = req.body || {};
    const url = await saveUpload({ filename, contentType, base64 });
    res.json({ ok: true, url });
  } catch (e) {
    sendError(res, e);
  }
});

// Local uploads folder (file mode only)
// Old image paths (before all photos moved to /photos) keep working.
app.get('/images/products/:file', (req, res) => res.redirect(301, `/photos/${req.params.file}`));
app.get('/images/home/:file', (req, res) => res.redirect(301, `/photos/home-${req.params.file}`));
app.get('/images/mazooq-logo.png', (_req, res) => res.redirect(301, '/photos/mazooq-logo.png'));

app.use('/uploads', express.static(path.join(__dirname, 'data', 'uploads')));

// ===========================================================================
// Serve the built site + admin page
// ===========================================================================
const dist = path.join(__dirname, 'dist');
app.use(express.static(dist));

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(dist, 'admin.html'));
});
app.get('*', (_req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Mazooq Foods running: http://localhost:${port}`);
  const { configured } = getConfig();
  console.log(`Razorpay:   ${configured ? 'configured' : 'NOT configured (set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)'}`);
  console.log(`Admin store: ${storeMode()}${adminConfigured() ? '' : ' (ADMIN_PASSWORD not set - admin login disabled)'}`);
});
