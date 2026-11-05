# Mazooq Website — Upgrade Plan (Customer / Retailer / Admin separation)

> Ye plan us upgrade spec ke against hai jo aapne di (3 separated experiences + wholesale pricing).
> **Approach:** Rebuild NAHI — existing architecture extend kar rahe hain, design same rahega.

---

## Current Architecture (assessment — kya-kya hai)

| Cheez | Abhi kya hai |
|---|---|
| Frontend | React 19 + Vite + Tailwind 4, single-page app (state-based views, no router) |
| Backend | Express (`server.js`) + Vercel functions (`api/*`) |
| Database | Supabase (ready) + local file fallback — products/orders/leads already stored |
| Admin Panel | ✅ Hai (`/admin`) — password login, Products CRUD (+photo upload), Orders, Leads |
| Payments | ✅ Razorpay server-verified (create-order → verify → webhook) + COD |
| Retailer | Sirf registration form (leads me jaata hai) — **login/dashboard nahi hai** |
| Customer accounts | ❌ Nahi (guest checkout) |
| Roles/RBAC | Sirf admin password — **customer/retailer roles nahi** |
| Pricing | Sab ke liye same retail price (`server/catalog.js` se validated) |

## Gap Analysis (spec ke hisaab se)

| # | Spec item | Status | Phase |
|---|-----------|--------|-------|
| 1 | Tea/Dates alag sections hatao → Shop + categories | ✅ **DONE (Phase 1)** | 1 |
| 2 | Retailer Login + registration → approval flow | ❌ TODO | 2 |
| 3 | Customer/Retailer separation (pricing + UI) | ❌ TODO | 2-3 |
| 4 | RBAC (CUSTOMER/RETAILER/ADMIN) backend-enforced | ❌ TODO | 2 |
| 5 | Admin dedicated login (`/admin` → login → dashboard) | ✅ Base hai (login screen → dashboard) | 2 (refine) |
| 6 | Admin product management | ✅ Base hai (add/edit/delete/photo) | 2 (fields extend: SKU, stock, retailer price, featured, sale price) |
| 7 | Retailer pricing rules (per-product quantity tiers) | ❌ TODO | 3 |
| 8 | Quantity-based pricing (server-side calculation) | ❌ TODO | 3 |
| 9 | Retailer approval workflow (PENDING/APPROVED/REJECTED/SUSPENDED) | ❌ TODO | 2 |
| 10 | Retailer dashboard (orders, account, pricing) | ❌ TODO | 4 |
| 11 | Role-aware UI (guest/customer/retailer/admin) | ❌ TODO | 2-4 |
| 12 | Role-based Header/Navigation | Partial (nav simplified) | 4 |
| 13 | Customer Login/Register + account | ❌ TODO | 5 |
| 14 | DB models (users, roles, pricing rules) | ❌ TODO | 2-3 |
| 15 | Security (hashing, tokens, server-side validation) | Admin password hai; user auth TODO | 2 |
| 16 | Design preserve | ✅ Will preserve | — |
| 17 | Mobile responsiveness | ✅ Will maintain | — |
| 18 | Don't break existing | ✅ Incremental approach | — |
| 19 | Code cleanup | Partial (Tea/Dates nav removed) | ongoing |
| 20 | Testing (full matrix) | Har phase ke baad | ongoing |

---

## Phases (build order)

### ✅ Phase 1 — Navigation & Shop restructure (AAJ DONE)
- Header nav: `Home | Shop | Our Story | Global Vision | Retailer Portal | Contact` (Tea/Dates top-level removed)
- Home + Footer ke Tea/Dates links ab **Shop ko category-filtered** kholte hain (Tea/Dates/Nuts/Snacks/Spices chips)
- Design bilkul same — sirf navigation structure clean hua

### ✅ Phase 2 — Auth & Roles foundation (DONE ✅)
- **DB (Supabase):** `users` (email, password_hash, role, status, retailer jsonb) + `sessions` tables (+ `supabase/migration-phase2.sql` existing setups ke liye)
- **Server APIs:** customer register, retailer register (PENDING approval), login/logout/me — scrypt password hashing + HttpOnly cookie sessions (30 din)
- **RBAC foundation:** server-enforced; admin APIs token-protected; unauthorized requests → 401
- **Admin Panel:** naya **Retailers tab** — Approve / Reject / Suspend / Reactivate
- **UI:** Header me "Account" icon → Customer Login/Register + Retailer status view; Retailer form ab real account banata hai (password ke saath)
- **Testing:** 15-point e2e pass (register/login/dup 409/wrong-pw 401/approve/suspend/reactivate/security 401s/logout)

### 🔜 Phase 3 — Wholesale pricing engine
- **DB:** `retailer_pricing_rules` (product_id, min_qty, max_qty, price) — admin UI per product (tier editor)
- **Server:** price calculation API — role-aware: guest/customer → retail price; approved retailer → quantity-based tier price
- **Checkout:** Razorpay order + COD **server-side validated pricing** (frontend price kabhi trust nahi hota)
- Admin: **Pricing tab** (rules banao/edit karo)

### 🔜 Phase 4 — Retailer dashboard + role-aware UI
- Retailer dashboard page: welcome, account info, applicable prices, orders/history, cart, logout
- Header per role: Guest/Customer normal; Retailer → Dashboard + Orders links; Admin → Admin button
- Retailer ka Shop view = retailer prices dikhenge (badge: "Wholesale")

### 🔜 Phase 5 — Customer accounts + order history
- Customer login/register pages, account page (orders history), checkout "logged in" flow
- Orders apne account se linked

### 🔜 Phase 6 — Full testing + polish + report
- Spec ka poora test matrix: customer / retailer / admin / security (URL manipulation, API authorization, price tampering)
- Mobile checks, final report

---

## Security approach (spec #15)

- Passwords: **bcrypt hashing** (never plain text)
- Sessions: HTTP-only, secure cookies + server-side session table
- **Sab pricing/calculation server-side** — frontend se aaya price/role/quantity kabhi trust nahi hoga
- Admin APIs: token-protected (already) + retailer APIs: role-checked
- Unauthorized requests → 401/403 (koi data leak nahi)

## Notes

- **Sab kuch incremental** — har phase ke baad site build + test; live link chalta rahega
- Har phase ke baad aapko update milega; design kabhi nahi tootega
- Production DB (Supabase) setup hote hi roles/pricing sab real data par chalega
