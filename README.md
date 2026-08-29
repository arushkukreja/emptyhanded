# EmptyHanded

A gift recommendation web app. Track upcoming events for the people in your life, get personalized gift ideas from Gemini, and receive an email reminder a week before the date.

- Next.js 16 (App Router) + TypeScript + Tailwind
- Supabase (auth + Postgres + RLS)
- Gemini (`gemini-3.6-flash`) for recommendations
- Stripe Checkout for the $4.99/mo subscription
- Resend for 7-day reminder emails, triggered by a Vercel cron

---

## 1. Install

This repo is shipped **without** `node_modules`. Run install yourself:

```bash
nvm use 22   # or otherwise ensure Node 22
npm install
```

## 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
EMAIL_UNSUBSCRIBE_SECRET=
RATE_LIMIT_SECRET=
CRON_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- `GEMINI_API_KEY` — Google AI Studio key.
- `SUPABASE_SECRET_KEY` — a modern server-only Supabase secret key. Never prefix it with `NEXT_PUBLIC_` or commit it.
- `RATE_LIMIT_SECRET` — at least 32 random bytes used to pseudonymize rate-limit identifiers.
- `STRIPE_PRICE_ID` — a recurring $4.99/month Price in Stripe.
- `CRON_SECRET` — any long random string; Vercel Cron sends it as `Authorization: Bearer <secret>` (configure it as an env var on the project).
- `RESEND_API_KEY` — Resend account. You'll also need to verify `emptyhanded.app` (or change the `from:` address in `app/api/cron/reminders/route.ts`).

## 3. Supabase setup

1. Create a Supabase project. Copy the URL, publishable key, and server-side secret key into a gitignored local environment file.
2. In the Supabase SQL editor, run **`supabase/migrations/0001_init.sql`** (creates tables, RLS, trigger, indexes).
3. Run **`supabase/migrations/0002_seed_products.sql`** to seed the sample catalog.

Auth: Email/password is enabled by default. If you keep email confirmation on, set the Site URL in Supabase Auth settings so the confirmation link redirects back to `${APP_URL}/auth/callback`.

## 4. Stripe setup

1. Create a Product + recurring monthly $4.99 Price. Put its ID in `STRIPE_PRICE_ID`.
2. Local dev: `stripe listen --forward-to localhost:3000/api/stripe/webhook` and put the printed signing secret into `STRIPE_WEBHOOK_SECRET`.
3. Production: add the same endpoint at `https://<your-domain>/api/stripe/webhook` and use that signing secret.

## 5. Reminders (Resend + cron)

- Verify a sending domain in Resend (`emptyhanded.app` per the template, or edit `from:` to your own).
- The cron is declared in `vercel.json`: daily at `0 9 * * *` UTC, hitting `/api/cron/reminders`.
- Locally you can simulate it:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/reminders
```

Email reminders are gated to users with `subscription_status = 'active'` (paid).

## 6. Run

```bash
npm run dev
```

App boots at http://localhost:3000.

## 7. Deploy to Vercel

```bash
vercel link
vercel env pull .env.local       # or set env vars in the dashboard
vercel deploy --prod
```

Make sure all env vars from step 2 exist on Vercel (Production + Preview). The cron in `vercel.json` will start running automatically once deployed to production.

---

## What lives where

- `app/` — Next.js routes. `(auth)` group holds login/signup; `(app)` group holds the authenticated layout, dashboard, events, upgrade.
- `app/api/stripe/{checkout,webhook}` — Checkout session creator + webhook → updates `users.subscription_status`.
- `app/api/cron/reminders` — Daily cron sending 7-day-out reminders to subscribed users.
- `components/` — Hand-rolled Tailwind primitives (Button, Card, Input, Select, Textarea, Chip, Badge, EmptyState, EventCard, RecommendationCard, Nav).
- `lib/supabase/{client,server,admin,middleware}.ts` — Three Supabase client flavors + session-refresh helper.
- `lib/recommendations/{gemini,save}.ts` — Catalog-aware Gemini recommendation pipeline.
- `lib/stripe.ts` — Stripe singleton.
- `lib/email/reminder.tsx` — Inline-styled HTML email template.
- `lib/limits.ts` — Free-tier gate (max 2 distinct recipient names per user).
- `supabase/migrations/` — SQL: schema, RLS policies, trigger, seed products.
- `middleware.ts` + `lib/supabase/middleware.ts` — Auth gating and session refresh on every request.
- `vercel.json` (+ `vercel.ts`) — Cron declaration.
