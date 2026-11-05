// server/notify-email.js
// Email notifications via Resend (https://resend.com — free tier: 3,000 emails/month).
//
//   - New order (COD or paid online)  → alert email to you  + confirmation to the customer
//   - Retailer application            → alert email to you
//   - Contact-form message            → alert email to you (Reply goes straight to the sender)
//
// Environment variables (all optional — without RESEND_API_KEY emails are skipped
// and the order is still saved + shown in the Admin panel):
//   RESEND_API_KEY     re_xxx (Resend dashboard → API Keys)
//   EMAIL_FROM         "Mazooq Foods <orders@mazooq.com>" (domain must be verified in Resend)
//   ORDER_ALERT_EMAIL  where alerts go (comma-separated allowed). Default: info@mazooq.com
//
// Email failures are logged and never block an order.

// RESEND_API_URL override is for local testing only.
const RESEND_URL = process.env.RESEND_API_URL || 'https://api.resend.com/emails';
const BRAND = '#00290f';
const GOLD = '#765b00';
const WHATSAPP = '+91 91019 91467';

function config() {
  return {
    apiKey: process.env.RESEND_API_KEY || '',
    from: process.env.EMAIL_FROM || 'Mazooq Foods <orders@mazooq.com>',
    alertTo: (process.env.ORDER_ALERT_EMAIL || 'info@mazooq.com')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

export function emailConfigured() {
  return Boolean(config().apiKey);
}

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());

async function send({ to, subject, html, replyTo }) {
  const { apiKey, from } = config();
  if (!apiKey) {
    console.log(`[email] RESEND_API_KEY not set - skipped: "${subject}"`);
    return { sent: false };
  }
  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo && isEmail(replyTo) ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error(`[email] Resend error ${res.status}:`, (await res.text()).slice(0, 300));
      return { sent: false };
    }
    return { sent: true };
  } catch (e) {
    console.error('[email] send failed:', e?.message);
    return { sent: false };
  }
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------
function layout(title, body) {
  return `<!doctype html><html><body style="margin:0;background:#f6fbf1;font-family:Arial,Helvetica,sans-serif;color:#181d17">
<div style="max-width:600px;margin:0 auto;padding:24px">
  <div style="background:${BRAND};color:#ffdf93;padding:16px 20px;border-radius:12px 12px 0 0;font-weight:bold;letter-spacing:1px">MAZOOQ FOODS</div>
  <div style="background:#fff;padding:20px;border:1px solid #dfe4da;border-top:0;border-radius:0 0 12px 12px">
    <h2 style="margin:0 0 12px;color:${BRAND};font-size:20px">${esc(title)}</h2>
    ${body}
  </div>
  <p style="font-size:11px;color:#717970;text-align:center;margin-top:12px">Mazooq Foods Private Limited • info@mazooq.com • WhatsApp ${WHATSAPP}</p>
</div></body></html>`;
}

function itemsTable(items, totals) {
  const rows = (items || [])
    .map(
      (it) => `<tr>
        <td style="padding:6px 0;border-bottom:1px solid #ebefe6">${esc(it.name)} <span style="color:#717970">(${esc(it.variantSize)})</span>${it.isRetailerPrice ? ' <span style="color:' + GOLD + ';font-size:11px">wholesale</span>' : ''}</td>
        <td style="padding:6px 0;border-bottom:1px solid #ebefe6;text-align:center">× ${esc(it.quantity)}</td>
        <td style="padding:6px 0;border-bottom:1px solid #ebefe6;text-align:right">${inr(it.price * it.quantity)}</td>
      </tr>`
    )
    .join('');
  const t = totals || {};
  return `<table style="width:100%;border-collapse:collapse;font-size:13px">${rows}
    <tr><td colspan="2" style="padding:6px 0;color:#717970">Subtotal</td><td style="text-align:right">${inr(t.subtotal)}</td></tr>
    <tr><td colspan="2" style="padding:2px 0;color:#717970">Shipping</td><td style="text-align:right">${t.shipping ? inr(t.shipping) : 'FREE'}</td></tr>
    <tr><td colspan="2" style="padding:8px 0;font-weight:bold;color:${BRAND}">Total</td><td style="text-align:right;font-weight:bold;color:${GOLD}">${inr(t.total)}</td></tr>
  </table>`;
}

function customerBlock(c) {
  c = c || {};
  const addr = [c.address, c.city, c.state, c.pincode].filter(Boolean).map(esc).join(', ');
  return `<p style="font-size:13px;line-height:1.6;margin:12px 0 0">
    <b>${esc(c.name) || '-'}</b><br>
    📞 ${esc(c.phone) || '-'}${c.email ? `<br>✉️ ${esc(c.email)}` : ''}<br>
    📍 ${addr || '-'}
  </p>`;
}

function paymentLabel(order) {
  return order.type === 'COD_ORDER' ? 'Cash on Delivery — collect on delivery' : 'Paid online (Razorpay)';
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/** New order → alert to you + confirmation to the customer (if they gave an email). */
export async function emailNewOrder(order) {
  const { alertTo } = config();
  const ref = order.receipt || order.razorpay?.orderId || 'new order';
  const who = order.orderRole === 'RETAILER' ? 'Retailer order' : 'New order';
  const total = order.totals ? inr(order.totals.total) : '';

  const alert = send({
    to: alertTo,
    subject: `🛒 ${who} ${ref} — ${total} (${order.type === 'COD_ORDER' ? 'COD' : 'PAID'})`,
    replyTo: order.customer?.email,
    html: layout(`${who} ${ref}`, `
      <p style="font-size:13px;margin:0 0 12px"><b>Payment:</b> ${esc(paymentLabel(order))}${order.razorpay?.paymentId ? `<br><b>Razorpay payment ID:</b> ${esc(order.razorpay.paymentId)}` : ''}</p>
      ${itemsTable(order.items, order.totals)}
      <h3 style="font-size:14px;color:${BRAND};margin:16px 0 0">Deliver to</h3>
      ${customerBlock(order.customer)}
      <p style="font-size:12px;color:#717970;margin-top:16px">Also saved in your Admin panel → Orders.</p>`),
  });

  const customerEmail = order.customer?.email;
  const confirmation = isEmail(customerEmail)
    ? send({
        to: customerEmail,
        subject: `Your Mazooq order ${ref} is confirmed`,
        replyTo: alertTo[0],
        html: layout(`Thank you, ${order.customer?.name || 'friend'}!`, `
          <p style="font-size:13px;line-height:1.6;margin:0 0 12px">We've received your order <b>${esc(ref)}</b> and are getting it ready. We'll share tracking details once it's dispatched.</p>
          <p style="font-size:13px;margin:0 0 12px"><b>Payment:</b> ${order.type === 'COD_ORDER' ? 'Cash on Delivery — please keep the amount ready' : 'Paid online'}</p>
          ${itemsTable(order.items, order.totals)}
          <h3 style="font-size:14px;color:${BRAND};margin:16px 0 0">Delivering to</h3>
          ${customerBlock(order.customer)}
          <p style="font-size:13px;line-height:1.6;margin-top:16px">Questions? Just reply to this email or WhatsApp us on <b>${WHATSAPP}</b> with your order number.</p>`),
      })
    : Promise.resolve({ sent: false });

  const [a, c] = await Promise.all([alert, confirmation]);
  return { alertSent: a.sent, confirmationSent: c.sent };
}

/** Retailer / wholesale application → alert to you. */
export async function emailRetailerApplication(app) {
  const a = app || {};
  const rows = [
    ['Business', a.businessName],
    ['Contact', a.contactName],
    ['Phone / WhatsApp', a.phone],
    ['Email', a.email],
    ['City', a.city],
    ['Business type', a.businessType],
    ['GSTIN', a.gstin],
    ['Interested in', a.interestProducts],
    ['Notes', a.notes],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#717970;white-space:nowrap">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
    .join('');
  return send({
    to: config().alertTo,
    subject: `🏪 New retailer application — ${a.businessName || a.contactName || 'unknown'}`,
    replyTo: a.email,
    html: layout('New retailer application', `<table style="font-size:13px">${rows}</table>
      <p style="font-size:12px;color:#717970;margin-top:16px">Approve or reject it in Admin panel → Retailers.</p>`),
  });
}

/** Contact-form message → alert to you (Reply answers the sender directly). */
export async function emailContactMessage(m) {
  return send({
    to: config().alertTo,
    subject: `✉️ Website message: ${m.subject || 'General enquiry'} — ${m.name}`,
    replyTo: m.email,
    html: layout(m.subject || 'New website message', `
      <p style="font-size:13px;line-height:1.6;margin:0 0 12px"><b>${esc(m.name)}</b><br>✉️ ${esc(m.email)}${m.phone ? `<br>📞 ${esc(m.phone)}` : ''}</p>
      <div style="font-size:13px;line-height:1.6;white-space:pre-wrap;background:#f6fbf1;padding:12px;border-radius:8px">${esc(m.message)}</div>
      <p style="font-size:12px;color:#717970;margin-top:16px">Hit Reply to answer ${esc(m.name)} directly.</p>`),
  });
}
