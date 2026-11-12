# Working together on Mazooq Foods

Two or more people change this project. These rules keep us from overwriting each other's work
and keep the **live website** safe.

> **`main` = the live website.** Once Google Cloud Run is connected, every change merged into
> `main` goes live automatically. Never push unfinished work to `main`.

---

## The workflow (every task)

```bash
# 1. Start from the latest version
git checkout main
git pull

# 2. Make your own branch for this task (short name: who/what)
git checkout -b yourname/short-description      # e.g. ali/fix-checkout-button

# 3. Work, then save small steps
git add -A
git commit -m "Explain what changed in one line"

# 4. Before uploading, bring in anything your partner merged meanwhile
git pull --rebase origin main

# 5. Check the site still builds
npm run lint
npm run build

# 6. Upload your branch
git push -u origin yourname/short-description
```

7. On GitHub, click **"Compare & pull request"**, describe the change, and create the Pull Request (PR).
8. The **other person** looks at it and clicks **Merge**. Then delete the branch.

Keep branches short-lived (a day or two). Many small PRs are better than one huge one.

---

## Rules

1. **Pull before you start, pull before you push.**
2. **Never force-push** (`git push --force`). It can delete your partner's work.
3. **Never push directly to `main`**. Always go through a Pull Request.
4. **Tell each other before editing the same file.** Rough split of who owns what:

   | Area | Folders |
   |---|---|
   | Design, pages, photos | `src/views`, `src/components`, `src/index.css`, `public/photos` |
   | Products & prices | `src/data`, `shared/retailer-pricing.js` |
   | Server, payments, database | `server/`, `api/`, `server.js` |
   | Hosting | `Dockerfile`, `vercel.json`, `GOOGLE-CLOUD-GUIDE.md` |

5. **Track work in GitHub Issues**: one issue per task, assigned to the person doing it.
6. **Product photos:** use real photos only. Put them in `public/photos/` and keep the same file name
   when replacing one.

---

## Never commit secrets (this repo is public)

- `.env` files, admin passwords, Razorpay keys, Resend keys, Google service-account `.json` keys
  stay on your own computer and in Google Cloud settings, **never** in GitHub.
- Copy `.env.example` to `.env` for your own local values.
- `data/` (local customer and order data) is ignored on purpose. Don't force-add it.

If a secret is ever pushed by mistake, **change that password or key immediately**. Deleting the
file afterwards is not enough, because GitHub keeps the history.

---

## Running the site locally

```bash
npm install
npm run dev          # website at http://localhost:3000
npm start            # server + APIs at http://localhost:8080 (uses local file database)
```

On Windows you can also double-click `START-LIVE-SERVER.bat`.

---

## If you get a conflict

Git says `CONFLICT` when you both changed the same lines. Nothing is lost.

1. Open the file and look for `<<<<<<<`, `=======`, `>>>>>>>`.
2. Keep the right version (or combine both), and delete those marker lines.
3. `git add <file>`, then `git rebase --continue` (or `git commit` if you were merging).
4. If unsure, **stop and ask** your partner instead of guessing. `git rebase --abort` undoes the attempt.

---

## Backups

- Branch `backup/supabase-version` / tag `supabase-backup-2026-11-12`: the site before the Firestore switch.
- Don't delete backup branches or tags without agreeing first.
