# InvestTable 🚀

EU Startup Discovery Platform for investors. Built with Next.js 15, TypeScript, Tailwind CSS, React-Leaflet, Supabase, and Stripe.

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Fill in your keys (or leave mock values to run without integrations)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Architecture

```
invest-table/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout + Sonner toast
│   ├── globals.css                 # Tailwind + Leaflet styles
│   ├── checkout/page.tsx           # Stripe checkout page
│   ├── dashboard/page.tsx          # Protected investor dashboard
│   ├── onboarding/page.tsx         # Startup registration page
│   └── api/
│       └── stripe/
│           ├── checkout/route.ts   # POST → Stripe Checkout Session
│           └── webhook/route.ts    # Stripe webhook handler
│
├── components/
│   ├── map/
│   │   ├── InvestMap.tsx           # Main map (React-Leaflet, custom dots)
│   │   ├── MapFilterBar.tsx        # Category filter buttons
│   │   └── StartupPopup.tsx        # Startup detail card on marker click
│   ├── forms/
│   │   └── OnboardingForm.tsx      # 4-step startup registration form
│   ├── dashboard/
│   │   └── SavedSearchPanel.tsx    # Saved searches + alert toggles
│   └── ui/
│       ├── Button.tsx              # Reusable button variants
│       ├── Card.tsx                # Glass card component
│       ├── CategoryBadge.tsx       # Colored category pill
│       ├── Toggle.tsx              # Boolean toggle switch
│       └── PricingCard.tsx         # €39/mo pricing card
│
├── lib/
│   ├── supabase.ts                 # Supabase client + SQL schema
│   ├── stripe.ts                   # Stripe loader + plan config
│   ├── mock-data.ts                # 10 sample EU startups
│   └── utils.ts                    # cn(), CATEGORY_CONFIG, matchesFilters()
│
├── types/
│   └── index.ts                    # Startup, Investor, SavedSearch, etc.
│
└── public/
    └── uploads/                    # Mock pitch deck storage folder
```

---

## Features

### 🗺️ Interactive EU Map
- React-Leaflet with CartoDB light tiles
- Custom **dot markers** (not default pins) colored by category
- Click a dot → glass popup with startup details
- **Category filter bar**: Tech · Food · Service · Sustainability
- Location-pick mode for startup registration

### 💳 Subscription (Stripe)
- €39/month "Investor Pro" plan
- `POST /api/stripe/checkout` creates a Checkout Session
- `POST /api/stripe/webhook` handles `checkout.session.completed`, `subscription.deleted`, `invoice.payment_failed`
- Investor subscription status synced to Supabase

### 📋 Startup Onboarding (4 steps)
1. **Basic Info** — name, tagline, category, stage, team size
2. **Location** — click-to-place on EU map
3. **Pitch Deck** — PDF upload (saved to `/public/uploads` mock)
4. **GDPR** — compliance toggle + registration summary

### 🔔 Saved Searches & Alerts
- Create saved searches with category + city filters
- Toggle alerts on/off per search
- "Test" button simulates a notification toast when a startup matches
- `matchesFilters()` utility for consistent matching logic

### 🗄️ Database (Supabase)
The SQL schema is in `lib/supabase.ts` → `SCHEMA_SQL`. Run it once in your Supabase SQL editor:

```sql
-- Tables: investors, startups, saved_searches, notifications
-- Row-Level Security policies included
-- UUID primary keys, JSONB filter storage
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRICE_ID` | Price ID for the €39/mo plan |
| `NEXT_PUBLIC_APP_URL` | Base URL (e.g. http://localhost:3000) |

> **Without keys**: The app runs fully with mock data. Supabase calls gracefully fail, and Stripe shows a toast instead of redirecting.

---

## Design System

- **Font**: SF Pro system font stack (native on Apple devices)
- **Radius**: `rounded-3xl` throughout (24px)
- **Glassmorphism**: `bg-white/70 backdrop-blur-xl border border-white/60`
- **Shadows**: Custom `shadow-glass`, `shadow-glass-lg`, `shadow-glass-xl`
- **Animation**: Tailwind keyframes — `animate-slide-up`, `animate-scale-in`, `animate-fade-in`

---

## Next Steps

- [ ] Add Supabase Auth (magic link or OAuth)
- [ ] Real pitch deck upload to Supabase Storage
- [ ] Admin panel for startup approval
- [ ] Email alerts via Resend or Supabase Edge Functions
- [ ] Full-text search with Postgres `tsvector`
