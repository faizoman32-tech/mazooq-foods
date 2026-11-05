# Mazooq Foods — Website

Premium Indian Foods storefront (Assam Tea, Dates, Dry Fruits, Snacks, Spices).
Built with React + Vite + Tailwind CSS, with real **Razorpay** payments.

> **"Pure Taste • Built with Trust" — Taste the smile**

## Quick Start (local)

```bash
npm install          # pehli baar (1-2 min)
npm run dev          # preview: http://localhost:3000
```

Production-style run (site + payment APIs):

```bash
npm run build
npm start            # http://localhost:8080
```

## Payments (Razorpay)

- Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` (see `.env.example`)
- Full setup + deployment guide: **[DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)**
- Note: `npm run dev` me payment demo-mode me simulate hota hai; real payments ke liye build + server (ya Vercel/Render deploy) chahiye.

## Updating the site

- Products/prices → `src/data/products.ts` → phir `npm run catalog:build`
- Company info → `src/data/company.ts`
- Colors → `src/index.css`
- Page texts → `src/views/*`

Full list: **[UPDATE-GUIDE.md](./UPDATE-GUIDE.md)**

## Deploy

- **Vercel:** repo import → env vars add → done (`api/` auto serverless functions)
- **Render:** Blueprint (`render.yaml`) ya Web Service: build `npm install && npm run build`, start `node server.js`

Steps: **[DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)**

## Project Structure

```
src/            # React app (views, components, data)
server/         # Shared payment logic + server-side price catalog
server.js       # Express server (site + APIs) for Render/VPS
api/            # Vercel serverless functions (same APIs)
scripts/        # build-catalog.mjs (prices sync)
```
