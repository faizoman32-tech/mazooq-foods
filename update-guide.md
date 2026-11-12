# Mazooq Foods — Update Guide (kya, kahan se update hota hai)

> Ye guide batati hai ke website me **kya-kya aur kahan se change** hota hai.
> Koi bhi change karne ke baad: `npm run build` chalao — koi error na aaye to redeploy (Vercel/Render par git push se auto hota hai).

---

## 1. Company / Branding Info
**File:** `src/data/company.ts`

- Naam: `legalName`, `brandName` ("Mazooq Foods")
- Slogan/Tagline: "Taste the smile" / "Pure Taste • Built with Trust"
- Founder, phones, email, website
- Assam unit + Kerala office ke addresses & FSSAI numbers
- Global ports list

## 2. Products — Naam, Price, Size, Description
**File:** `src/data/products.ts`

Har product me: `name`, `variants` (size + price), `description`, `story`, `origin`, `fssaiNumber`, `nutrition`, `image`.

⚠️ **ZAROORI:** Price ya size change karne ke baad ye command chalao:
```bash
npm run catalog:build
```
(Ye payment system ke liye server-side prices sync karta hai — warna checkout galat amount banayega. Server hamesha yahan se price check karta hai, customer ke browser se nahi — isse price chori nahi ho sakti.)

## 3. Colors / Theme
**File:** `src/index.css` (sabse upar `@theme` block me)

- `--color-primary: #00290f` → dark green (headers, buttons)
- `--color-secondary-fixed-dim: #f2c027` → gold (accent, buttons)
- `--color-secondary: #765b00` → brown-gold (labels)
- `--color-surface: #f6fbf1` → light background
- Poore theme ke colors wahin hain — ek change karne se poori site par lagega.

## 4. Fonts
- **File:** `index.html` (Google Fonts ka `<link>`) + `src/index.css` me `--font-serif` / `--font-sans`

## 5. Photos / Images
- **All photos are in ONE folder: `public/photos/`**
  - Product photos: `public/photos/<product-name>.png` (e.g. `premium-gold-tea.png`)
  - Home page: `home-*.jpg` • Our Story: `assam-tea-estate.jpg`, `mazooq-store.jpg` • Logo: `mazooq-logo.png`
  - To replace a photo: put your new photo in `public/photos/` with the **same file name** (easiest), or upload it in Admin → product → Image.
  - To replace a product photo: save your photo in `public/photos/` with the same name as the old one (e.g. `kerala-banana-chips.png`).
  - If any photo is missing or fails to load, the site automatically shows `photo-coming-soon.svg` instead of a broken image.
  - Exceptions: `favicon.svg`, `favicon-192.png`, `apple-touch-icon.png` and `og-image.jpg` stay in `public/` itself — browsers, WhatsApp and Google look for them there.
- **Note:** Behtar hai apni real product photos — premium brand ke liye zaroori.

## 6. Page Texts (headings, paragraphs)
**Folder:** `src/views/`
- `HomeView.tsx` — homepage ke sab sections
- `MazooqTeaView.tsx`, `MazooqDatesView.tsx` — category pages
- `ShopAllView.tsx` — poora catalog
- `OurStoryView.tsx` — company story
- `GlobalVisionView.tsx` — export/global section
- `RetailerPortalView.tsx` — B2B form
- `ContactView.tsx` — contact page
- **Header/Footer:** `src/components/Header.tsx`, `src/components/Footer.tsx`

## 7. Checkout Rules (shipping etc.)
**Files:** 
- `src/components/CheckoutModal.tsx` — display: `shippingCost = subtotal >= 1500 ? 0 : 99`
- `server/payments-core.js` — server rule: `subtotal >= 1500 ? 0 : 99`

⚠️ Shipping rule **dono jagah** same rakhna — ek jagah change karo to doosri jagah bhi!

## 8. Payment / Razorpay Settings
- Keys: `.env` (local) ya Vercel/Render dashboard ke Environment Variables me
- Poora process: **`DEPLOY-GUIDE.md`** dekho

## 9. Order Notifications (orders kahan aayenge)
- `ORDER_NOTIFY_WEBHOOK_URL` env set karo → har paid/COD order us URL par JSON ban ke jayega
- Best: Google Sheet (Apps Script) — steps `DEPLOY-GUIDE.md` me hain

## 10. Bonus: WhatsApp number lagana ho to
- `src/data/company.ts` me phone numbers hain; `ContactView` / `Footer` me WhatsApp button bana sakte ho: `https://wa.me/917002170175` jaisa link

---

## Publish se PEHLE ka checklist ✅

- [ ] **Product photos** apni asli photos se replace karein
- [ ] **Prices & sizes** final karein → `npm run catalog:build` chalao
- [ ] **Company info** (email/phone/address) sahi hai?
- [ ] **Razorpay** live keys + webhook set hai? (DEPLOY-GUIDE.md)
- [ ] **ORDER_NOTIFY_WEBHOOK_URL** set hai? (orders kahan aayenge)
- [ ] **Legal pages**: Terms / Privacy / Refund-Return / Shipping policy — abhi site me nahi hain, add karni chahiye (footer me link ke saath). Razorpay activation ke liye bhi helpful hain.
- [ ] **₹1 ka real test order** live keys se karke check karein
- [ ] **Mobile par** poora flow test karein

---

## 0. Admin Panel (recommended - products manage karne ka naya tareeka)

Ab products **Admin Panel** se manage hote hain (add/edit/delete + price + photo upload + orders + retailer leads):
- **Local:** `START-ADMIN.bat` par double-click -> http://localhost:8080/admin
- **Production:** `https://your-domain.com/admin` - poora setup: **ADMIN-SETUP-GUIDE.md** (10 min)
- **Code-based (developers):** products ab `src/data/products.generated.json` me hain - change ke baad `npm run build`.

## Policy pages (Privacy / Terms / Refund / Shipping)

- Text + key numbers (return window, delivery days, refund time) → `src/data/policies.ts` (`POLICY_SETTINGS` at the top)
- URLs: `/privacy-policy`, `/terms`, `/refund-policy`, `/shipping-policy` (linked in the footer)

## Wholesale (retailer) prices

- Tier prices are entered for ONE pack size ("Tier prices are for pack size" in Admin → product).
- Other pack sizes get the same % discount automatically, and never more than retail.
- Logic lives in `shared/retailer-pricing.js` (used by both checkout and the shop display).

## Page URLs

- Each page has its own address (`/shop`, `/shop/tea`, `/our-story`, `/contact`, ...) — see `src/routes.ts`.
- Adding a page: add it to `PageView` + `PAGE_PATHS` in `src/routes.ts`, render it in `src/App.tsx`, and add it to `public/sitemap.xml`.

## Database & hosting (Google Cloud)

- Production: **Google Cloud Run + Firestore** - full steps in `GOOGLE-CLOUD-GUIDE.md`.
- Database code: `server/admin-store.js` (chooses the database) and `server/firestore-store.js` (Firestore).
- Backup: Supabase still works with `ADMIN_STORE=supabase`; the pre-Firestore code is on GitHub branch `backup/supabase-version`.
