# Mazooq Foods — Publish Checklist 🚀 (Launch Ka Poora Plan)

> Ye file top-to-bottom follow karo. Har phase me time diya hai. Sabse pehle **Phase 0** shuru karo — Razorpay KYC me 2-3 din lagte hain!
> **Deploy abhi tak NAHI hua hai** — pehli baar yeh checklist follow karke deploy karenge.

---

## 🌐 WEBHOOKS — pehle ye samajh lo (3 alag cheezein hain!)

| # | Naam | Kahan set hota hai | Kya karta hai | Kahan daalna hai |
|---|------|--------------------|---------------|------------------|
| 1 | **Razorpay Webhook** | Razorpay Dashboard → Settings → Webhooks | Razorpay se server ko payment confirmation bhejta hai | URL: `https://YOURSITE.com/api/razorpay/webhook` + Secret bhi wahi env var me |
| 2 | **Order Notify Webhook** | Google Sheet (Apps Script) | Har order (paid + COD) aapki **Google Sheet** me row banata hai | URL env var `ORDER_NOTIFY_WEBHOOK_URL` me |
| 3 | **Deploy Hook** | Vercel/Render Settings | Admin me Save → website **automatically rebuild** (1-2 min) | URL env var `DEPLOY_HOOK_URL` me |

### Webhook 1 — Razorpay (payment confirmations) — exact steps
1. [dashboard.razorpay.com](https://dashboard.razorpay.com) → **Settings → Webhooks → Add New Webhook**
2. **Webhook URL:** `https://YOURSITE.com/api/razorpay/webhook`
3. **Secret:** ek random string likho (e.g. `mazooq_wh_2026_k9x2`) → **NOTE kar lo**
4. **Active Events** select karo: ✅ `payment.captured` ✅ `payment.failed`
5. Save → phir Vercel env me `RAZORPAY_WEBHOOK_SECRET` = wahi secret → Redeploy
6. **Test:** Webhooks page → apne webhook par "Send Test Event" → delivery 200 dikhni chahiye

### Webhook 2 — Google Sheet (orders aapko dikhen) — exact steps
1. [sheets.new](https://sheets.new) → naya sheet kholo → **Extensions → Apps Script**
2. Ye code paste karo:
   ```js
   function doPost(e) {
     const data = JSON.parse(e.postData.contents);
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
     sheet.appendRow([
       new Date(), data.type || '', data.receipt || '',
       (data.customer && data.customer.name) || '',
       (data.customer && data.customer.phone) || '',
       (data.totals && data.totals.total) || '',
       JSON.stringify(data)
     ]);
     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
3. **Deploy → New deployment → Web app** → Execute as: **Me** → Who has access: **Anyone** → Deploy
4. URL copy karo → Vercel env me `ORDER_NOTIFY_WEBHOOK_URL` me daalo → Redeploy
5. **Test:** site par ek COD order karo → sheet me row aani chahiye ✅

### Webhook 3 — Deploy Hook (admin auto-publish) — exact steps
1. Vercel → Project → **Settings → Git → Deploy Hooks** → Name: `admin-publish` → Create
2. URL copy → Vercel env `DEPLOY_HOOK_URL` → Redeploy
3. **Test:** Admin me koi product edit karke Save karo → 1-2 min me site update ✅
   *(Render par: Service → Settings → Deploy Hook)*

---

## Phase 0 — Accounts (AAJ shuru karo)
- [ ] **Razorpay account + KYC** — ⏳ 2-3 din (PAN, GST, bank proof) → SABSE PEHLE! [razorpay.com](https://razorpay.com)
- [ ] GitHub account — [github.com](https://github.com) (free)
- [ ] Vercel account — [vercel.com](https://vercel.com) (GitHub se signup)
- [ ] Supabase account — [supabase.com](https://supabase.com) (free)
- [ ] Google account (orders sheet ke liye)

## Phase 1 — Supabase (admin database) — ~10 min
👉 Poora walkthrough: **ADMIN-SETUP-GUIDE.md** (Part 2)
- [ ] Project banao → SQL Editor me `supabase/schema.sql` paste → Run
- [ ] Storage bucket `product-images` (Public ON)
- [ ] `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` note karo

## Phase 2 — GitHub + Vercel Deploy — ~20 min
1. [ ] **GitHub Desktop** ([desktop.github.com](https://desktop.github.com)) → Add Local Repository → `mazooq-foods-website` folder → **Publish repository**
2. [ ] Vercel → **Add New Project** → repo import (Vite auto-detect)
3. [ ] **Environment Variables** (ye 9 daalo):
   ```
   RAZORPAY_KEY_ID            (test key pehle)
   RAZORPAY_KEY_SECRET
   RAZORPAY_WEBHOOK_SECRET    (Webhook 1 ka secret)
   ORDER_NOTIFY_WEBHOOK_URL   (Webhook 2 ka URL)
   ADMIN_PASSWORD             (strong password - admin login)
   SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
   DEPLOY_HOOK_URL            (Webhook 3 ka URL)
   VITE_GA4_ID                (optional - analytics)
   ```
4. [ ] **Deploy** → live URL milega (e.g. `mazooq-foods.vercel.app`)
5. [ ] Webhooks 1-2-3 ab final domain ke saath set karo (upar dekho)

## Phase 3 — Domain — ~15 min (+ DNS wait)
- [ ] **DECISION:** `mazooq.com` abhi **WordPress site** par hai. Options:
  - (a) Isi par naya site **replace** karna hai, ya
  - (b) Pehle **new.mazooq.com** subdomain par test, phir main domain?
- [ ] Vercel → Settings → **Domains** → add karo → jo DNS records bataye wo domain provider me lagao
- [ ] SSL automatic ✓ | **Razorpay webhook URL me final domain confirm karo!**

## Phase 4 — Content Final — (business kaam, 1-2 din)
- [ ] **Real product photos** → Admin Panel → Edit product → **Upload photo** (ab code nahi chhedna! 🎉)
- [ ] Prices/sizes final check — Admin Panel se instant edit
- [ ] Legal pages add karo (Terms / Privacy / Refund / Shipping)
- [ ] Company naam confirm: **"Mazooq Foods"** ya **"Mazooq Tea"**? (site me Foods hai)
- [ ] GA4 ID (analytics) — [analytics.google.com](https://analytics.google.com) → `VITE_GA4_ID`

## Phase 5 — Testing (test keys) — ~1 ghanta
- [ ] Admin live par kholo: `https://YOURSITE.com/admin` → login
- [ ] **Test order** (UPI: `success@razorpay`, Card: `4111 1111 1111 1111`)
      → order confirm screen ✓ → Admin → Orders me dikha ✓ → Google Sheet me aaya ✓
- [ ] **COD order** test → sheet + admin me
- [ ] **Retailer form** test → Admin → Leads me
- [ ] Razorpay → Webhooks → **Send Test Event** → 200 OK
- [ ] **Mobile par** poora checkout test

## Phase 6 — GO LIVE 🚀
- [ ] Razorpay me KYC approve? → **Live Keys** generate → Vercel env me replace → Redeploy
- [ ] **₹1 ka real order** khud se karo → settlement (T+2) check
- [ ] Google Search Console + Google Business Profile (👉 SEO-GUIDE.md)
- [ ] Announcement! Instagram/WhatsApp par launch post

---

## Current Status (kya ready hai ✅)

| Cheez | Status |
|---|---|
| Website (design, 20 products, cart, checkout) | ✅ Ready |
| Razorpay payments (server-verified) | ✅ Code ready — keys + KYC chahiye |
| Admin Panel (products/orders/leads + photo upload) | ✅ Ready — chalu hai (localhost:8080/admin) |
| Order → Google Sheet forwarding | ✅ Code ready — Sheet URL chahiye |
| Admin auto-publish (deploy hook) | ✅ Code ready — hook URL chahiye |
| SEO (meta, sitemap, structured data) | ✅ Done |
| Deploy configs (Vercel/Render) | ✅ Ready |
| **Baaki sab aapke accounts + content ka kaam hai** 👆 |
