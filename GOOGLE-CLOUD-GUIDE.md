# Mazooq Foods on Google Cloud (Cloud Run + Firestore)

The website runs on **Google Cloud Run** and stores everything (products, orders, customer and
retailer accounts, messages) in **Google Cloud Firestore**. Photos uploaded in the Admin panel go
to **Google Cloud Storage**.

| Part | Google service | Free tier (approx.) |
|---|---|---|
| Website + APIs (`server.js`) | Cloud Run | 2 million requests / month |
| Database | Firestore (Native mode) | 1 GB storage, 50k reads + 20k writes / day |
| Admin photo uploads | Cloud Storage bucket | 5 GB (in US regions) |

---

## 1. One-time Google Cloud setup (in the browser)

1. Go to **https://console.cloud.google.com** → create a project, e.g. `mazooq-foods`.
   Note the **Project ID** (e.g. `mazooq-foods-123456`).
2. **Billing** → link a billing account (needed for Cloud Run, even inside the free tier).
3. **Firestore** → *Create database* → **Native mode** → location **asia-south1 (Mumbai)** →
   *Production rules*. (The site talks to Firestore only from the server, so no public rules are needed.)
4. **Cloud Storage → Buckets** → *Create* → name e.g. `mazooq-foods-photos` → location **asia-south1** →
   *Uniform access* → untick "Enforce public access prevention" → Create.
   Then **Permissions → Grant access** → principal `allUsers` → role **Storage Object Viewer**
   (makes the product photos viewable on the website).

## 2. Deploy the website to Cloud Run

Easiest: **Cloud Run → Create service → "Continuously deploy from a repository"** →
connect GitHub → choose `faizoman32-tech/mazooq-foods`, branch `main` → Build type **Dockerfile**
(the repo already has one) → Region **asia-south1** → *Allow unauthenticated invocations* → Create.

Every push to GitHub `main` then redeploys the site automatically.

(Alternative, from a terminal with the gcloud CLI:
`gcloud run deploy mazooq-foods --source . --region asia-south1 --allow-unauthenticated`)

## 3. Environment variables (Cloud Run → service → *Edit & deploy new revision* → Variables)

| Variable | Value |
|---|---|
| `ADMIN_STORE` | `firestore` |
| `FIRESTORE_PROJECT_ID` | your Project ID |
| `GCS_BUCKET` | your bucket name, e.g. `mazooq-foods-photos` |
| `ADMIN_PASSWORD` | a **new strong password** (not the local default) |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | from Razorpay |
| `RESEND_API_KEY`, `EMAIL_FROM`, `ORDER_ALERT_EMAIL` | for order emails (see DEPLOYMENT-GUIDE.md) |

Put secret values (passwords, keys) in **Secret Manager** and reference them, or at least never
commit them to GitHub.

## 4. Permissions for the Cloud Run service account

Cloud Run → service → *Security* shows the service account (usually
`PROJECT_NUMBER-compute@developer.gserviceaccount.com`). In **IAM**, give it:

- **Cloud Datastore User** (read/write Firestore)
- **Storage Object Admin** on the photos bucket (upload photos)

No key files are needed - Cloud Run signs in to Firestore and Storage automatically.

## 5. First start

On the first visit the site copies the 20 products into Firestore automatically
(log line: `[firestore] seeded 20 products`). After that, edit products in **/admin**.

Check: `https://YOUR-SERVICE-URL/api/health` should show `"adminStore":"firestore"`.

---

## Going back to Supabase (backup plan)

The Supabase code is still in the project. Two ways back:

- **Only switch the database:** set `ADMIN_STORE=supabase` plus `SUPABASE_URL` and
  `SUPABASE_SERVICE_ROLE_KEY` (see ADMIN-SETUP-GUIDE.md). No code change needed.
- **Go back to the exact code from before Firestore:** GitHub branch
  `backup/supabase-version` (tag `supabase-backup-2026-11-12`).

## Running locally

Nothing changes: on your computer the site uses the local file `data/admin-store.json`.
To try Firestore from your computer, set `ADMIN_STORE=firestore`, `FIRESTORE_PROJECT_ID=...` and
`GOOGLE_APPLICATION_CREDENTIALS=path\to\service-account-key.json` (never commit that key file).
