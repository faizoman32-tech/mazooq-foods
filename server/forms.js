// server/forms.js
// Website forms: contact message + newsletter signup.
// Both are saved as "leads" (Admin panel → Leads). Contact messages also email you.
// Shared by server.js (Express) and api/*.js (Vercel functions).

import { addLead } from './admin-store.js';
import { notifyOrder } from './payments-core.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function err(code, message) {
  const e = new Error(message);
  e.code = code;
  return e;
}

const clip = (v, max) => String(v ?? '').trim().slice(0, max);

/** Hidden "website" field: real visitors leave it empty, spam bots fill it in. */
const isBot = (body) => Boolean(body && body.website);

export async function submitContact(body) {
  if (isBot(body)) return { ok: true };
  const message = {
    name: clip(body?.name, 100),
    email: clip(body?.email, 200).toLowerCase(),
    phone: clip(body?.phone, 30),
    subject: clip(body?.subject, 150) || 'General enquiry',
    message: clip(body?.message, 5000),
  };
  if (message.name.length < 2) throw err('INVALID_INPUT', 'Please enter your name.');
  if (!EMAIL_RE.test(message.email)) throw err('INVALID_INPUT', 'Please enter a valid email address.');
  if (message.message.length < 5) throw err('INVALID_INPUT', 'Please write a short message.');

  await addLead({ kind: 'CONTACT', ...message, contactName: message.name, notes: message.message }).catch((e) =>
    console.warn('[forms] contact save failed:', e?.message)
  );
  await notifyOrder({ type: 'CONTACT_MESSAGE', receivedAt: new Date().toISOString(), message });
  return { ok: true };
}

export async function submitNewsletter(body) {
  if (isBot(body)) return { ok: true };
  const email = clip(body?.email, 200).toLowerCase();
  if (!EMAIL_RE.test(email)) throw err('INVALID_INPUT', 'Please enter a valid email address.');
  await addLead({ kind: 'NEWSLETTER', email });
  return { ok: true };
}

/** Retailer sign-up (account + PENDING approval) → email alert to you. Password is never included. */
export async function notifyRetailerSignup(body) {
  const { password, ...rest } = body || {};
  const application = {
    businessName: clip(rest.businessName, 200),
    contactName: clip(rest.contactName, 100),
    phone: clip(rest.phone, 30),
    email: clip(rest.email, 200),
    city: clip(rest.city, 100),
    businessType: clip(rest.businessType, 100),
    gstin: clip(rest.gstin, 30),
    interestProducts: clip(rest.interestProducts, 500),
    notes: clip(rest.notes, 2000),
  };
  await notifyOrder({ type: 'RETAILER_APPLICATION', receivedAt: new Date().toISOString(), application });
}

export function formError(res, e) {
  const status = e?.code === 'INVALID_INPUT' ? 400 : 500;
  res.status(status).json({ ok: false, error: e?.code || 'error', message: e?.message || 'Something went wrong. Please try again.' });
}
