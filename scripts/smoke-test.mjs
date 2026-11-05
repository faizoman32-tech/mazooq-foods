// scripts/smoke-test.mjs
// Quick end-to-end smoke test of the main flows.
import crypto from 'node:crypto';

const BASE = process.env.BASE || 'http://localhost:8099';
const results = [];
let cookieJar = '';

function log(label, ok, detail) {
  results.push({ label, ok, detail });
  const mark = ok ? '✓' : '✗';
  console.log(`${mark}  ${label}${detail ? ' -> ' + detail : ''}`);
}

async function fetchJson(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (cookieJar) headers.Cookie = cookieJar;
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  let body = null;
  try { body = await res.json(); } catch { /* ignore */ }
  // Capture set-cookie
  const sc = res.headers.get('set-cookie');
  if (sc) {
    const m = sc.match(/mzq_session=([^;]+)/);
    if (m) cookieJar = `mzq_session=${m[1]}`;
  }
  return { status: res.status, body };
}

console.log('\n=== Mazooq Smoke Test ===\n');

// 1. Health
{
  const r = await fetchJson('/api/health');
  log('Health check', r.status === 200 && r.body?.ok, `store=${r.body?.adminStore}`);
}

// 2. Public catalog
{
  const r = await fetchJson('/api/catalog');
  const n = Array.isArray(r.body?.products) ? r.body.products.length : 0;
  const hasRetailerPricing = r.body?.products?.some((p) => p.retailerPricing);
  log('Public catalog has 20 products', n === 20, `count=${n}`);
  log('Public catalog strips retailerPricing', !hasRetailerPricing, 'retailerPricing field absent');
}

// 3. Customer registration
{
  const email = `customer_${Date.now()}@test.com`;
  const r = await fetchJson('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password: 'testpass123', name: 'Test Customer' }),
  });
  log('Customer registration', r.status === 200 && r.body?.ok && r.body?.user?.role === 'CUSTOMER', `email=${email}`);
}

// 4. Customer logout
{
  const r = await fetchJson('/api/auth/logout', { method: 'POST' });
  log('Customer logout', r.status === 200 && r.body?.ok, 'session cleared');
  cookieJar = ''; // clear local jar too
}

// 5. Retailer registration (PENDING status)
let retailerEmail;
{
  retailerEmail = `retailer_${Date.now()}@test.com`;
  const r = await fetchJson('/api/auth/retailer/register', {
    method: 'POST',
    body: JSON.stringify({
      email: retailerEmail,
      password: 'retpass123',
      contactName: 'Retail Contact',
      businessName: 'Test Retail Pvt Ltd',
      phone: '+91 9999999999',
      gstin: '29ABCDE1234F1Z5',
      city: 'Bangalore, Karnataka',
      businessType: 'Supermarket',
      interestProducts: 'Tea, Dates',
      notes: 'Test retailer',
    }),
  });
  log('Retailer registration (PENDING)', r.status === 200 && r.body?.user?.role === 'RETAILER' && r.body?.user?.status === 'PENDING', `email=${retailerEmail}`);
}

// 6. Retailer login attempt (should succeed but still PENDING - no access)
let retailerCookie;
{
  const savedJar = cookieJar;
  cookieJar = '';
  const r = await fetchJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: retailerEmail, password: 'retpass123' }),
  });
  log('Retailer login (PENDING)', r.status === 200 && r.body?.user?.status === 'PENDING', `status=${r.body?.user?.status}`);
  retailerCookie = cookieJar;
  cookieJar = savedJar; // restore
}

// 7. Pending retailer tries to access /api/retailer/catalog -> 403
{
  const savedJar = cookieJar;
  cookieJar = retailerCookie;
  const r = await fetchJson('/api/retailer/catalog');
  log('Pending retailer blocked from retailer catalog', r.status === 403 && r.body?.error === 'retailer_not_approved', `status=${r.status}`);
  cookieJar = savedJar;
}

// 8. Admin login + approve retailer
let adminToken;
{
  const r = await fetchJson('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password: 'test12345' }),
  });
  adminToken = r.body?.token;
  log('Admin login', r.status === 200 && !!adminToken, 'token issued');
}

// 9. Admin lists retailers, finds our pending one
let retailerId;
{
  const r = await fetchJson('/api/admin/retailers', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const list = r.body?.retailers || [];
  const found = list.find((x) => x.email === retailerEmail);
  retailerId = found?.id;
  log('Admin lists retailers', r.status === 200 && !!found, `found ${list.length} retailers, our id=${retailerId}`);
}

// 10. Admin approves retailer
{
  const r = await fetchJson('/api/admin/retailers', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ id: retailerId, status: 'APPROVED' }),
  });
  log('Admin approves retailer', r.status === 200 && r.body?.ok, `retailerId=${retailerId}`);
}

// 11. Retailer logs in again, now APPROVED
{
  const savedJar = cookieJar;
  cookieJar = '';
  const r = await fetchJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: retailerEmail, password: 'retpass123' }),
  });
  log('Retailer login (APPROVED)', r.status === 200 && r.body?.user?.status === 'APPROVED', `status=${r.body?.user?.status}`);
  retailerCookie = cookieJar;
  cookieJar = savedJar;
}

// 12. Approved retailer accesses /api/retailer/catalog (now includes tiers)
{
  const savedJar = cookieJar;
  cookieJar = retailerCookie;
  const r = await fetchJson('/api/retailer/catalog');
  const hasTiers = r.body?.products?.some((p) => p.retailerPricing && p.retailerPricing.length > 0);
  log('Approved retailer accesses catalog WITH tiers', r.status === 200 && hasTiers, `products=${r.body?.products?.length}, tiers=${hasTiers}`);
  cookieJar = savedJar;
}

// 13. Server-side retailer pricing on a COD order (qty=10 triggers tier 1)
{
  const savedJar = cookieJar;
  cookieJar = retailerCookie;
  const r = await fetchJson('/api/orders/cod', {
    method: 'POST',
    body: JSON.stringify({
      items: [
        { productId: 'mazooq-premium-gold-tea', variantSize: '500g', quantity: 10 },
      ],
      customer: { name: 'Retailer Test', phone: '+9199999', email: retailerEmail, address: 'test', city: 'Blr', state: 'KA', pincode: '560001' },
    }),
  });
  // Customer price for 500g = ₹379 × 10 = ₹3790. Retailer tier1 (10-24) = ₹275 × 10 = ₹2750.
  const total = r.body?.totals?.total;
  const isRetailerOrder = r.body?.totals?.isRetailerOrder;
  log('Server-side retailer pricing (qty=10, tier1 ₹275)', r.status === 200 && isRetailerOrder && total === 2949, `total=${total} (2750+199 shipping)`);
  cookieJar = savedJar;
}

// 14. Customer tries to access /api/retailer/catalog -> 403
{
  // Register a fresh customer and try
  cookieJar = '';
  await fetchJson('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email: `customer2_${Date.now()}@test.com`, password: 'testpass123', name: 'Customer 2' }),
  });
  const r = await fetchJson('/api/retailer/catalog');
  log('Customer blocked from retailer catalog', r.status === 403, `status=${r.status}`);
}

// 15. Unauthorized admin product modification -> 401
{
  const r = await fetchJson('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify({ product: { id: 'hacked', name: 'Hack' } }),
  });
  log('Unauthorized admin API blocked', r.status === 401, `status=${r.status}`);
}

// 16. Retailer tries to access admin endpoints -> 401 (no admin token)
{
  const savedJar = cookieJar;
  cookieJar = retailerCookie;
  const r = await fetchJson('/api/admin/products');
  log('Retailer blocked from admin endpoints', r.status === 401, `status=${r.status}`);
  cookieJar = savedJar;
}

// 17. Admin can save a product with retailer pricing tiers
{
  const r = await fetchJson('/api/admin/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      product: {
        id: 'test-tier-product',
        name: 'Test Tier Product',
        category: 'tea',
        categoryLabel: 'Test Tea',
        subtitle: 'Test',
        description: 'Test desc',
        story: 'Test story',
        origin: 'Test origin',
        ingredients: 'test',
        preparationOrUsage: 'test',
        nutrition: { calories: '0', protein: '0g', carbs: '0g', fat: '0g', sodium: '0mg' },
        variants: [{ size: '100g', price: 100, weightInGrams: 100 }],
        image: 'https://example.com/test.jpg',
        retailerPricing: [
          { minQty: 5, maxQty: 9, pricePerUnit: 80 },
          { minQty: 10, maxQty: null, pricePerUnit: 70 },
        ],
      },
    }),
  });
  log('Admin saves product WITH retailer tiers', r.status === 200 && r.body?.ok, `deploy=${JSON.stringify(r.body?.deploy)}`);

  // Cleanup
  await fetchJson('/api/admin/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ action: 'delete', id: 'test-tier-product' }),
  });
}

console.log('\n=== Summary ===');
const passed = results.filter((r) => r.ok).length;
console.log(`${passed}/${results.length} passed\n`);
process.exit(passed === results.length ? 0 : 1);
