# Atlas Freight Capital

Enterprise-grade freight factoring platform scaffold built with Next.js App Router + Supabase.

## Stack

- Next.js 16 (App Router) + TypeScript
- Supabase Auth / Postgres / Storage / Realtime / RLS
- Tailwind CSS
- API routes for application/load workflows
- Role-aware portals (Carrier, Atlas Admin, Funding Partner, Super Admin)

## Product Areas Implemented

- Premium marketing site with trust sections and service pages
- Auth entry flow (email/password + magic link + role redirect)
- Carrier application intake with document upload hooks
- Carrier load submission with required docs + pricing calculation
- Broker credit check request workflow
- Portal dashboards for carrier/admin/partner/super
- Timeline, risk badges, status chips, KPI cards
- Signed URL endpoint for private document access
- Admin CSV report exports
- Admin load status, partner assignment, broker verification, and pricing APIs
- Partner submission review endpoint with assigned-partner checks
- Supabase migration containing:
  - Core data model tables requested
  - Status/risk/pricing/reserve/payment entities
  - Private storage buckets
  - RLS policies by role and ownership
- Seed data for initial funding partners, broker risk records, and platform settings

## Project Path

`C:\Atlas Frieght Capital\atlas-freight-capital`

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Add env vars from `.env.example` to `.env.local`

3. Run Supabase migration in your Supabase project:

- `supabase/migrations/20260429_atlas_initial.sql`

4. Optional: run seed data after migration:

- `supabase/seed.sql`

5. Start dev server

```bash
npm run dev
```

## Operational APIs

- `POST /api/admin/load-status`
- `POST /api/admin/assign-partner`
- `POST /api/admin/pricing`
- `POST /api/admin/broker-verifications`
- `GET /api/admin/reports/:report`
- `POST /api/partner/submission-review`

## Auth + Role Routing

Roles supported:

- `carrier_owner`
- `carrier_staff`
- `atlas_admin`
- `atlas_underwriter`
- `atlas_operations`
- `partner_admin`
- `partner_reviewer`
- `super_admin`

Redirect map:

- Carrier roles -> `/carrier/dashboard`
- Atlas roles -> `/admin/dashboard`
- Partner roles -> `/partner/dashboard`
- Super admin -> `/super/dashboard`

## Security Notes

- Private storage buckets only (no public document URLs)
- Signed URL endpoint for temporary access
- RLS policies for carrier ownership, partner assignment, admin privilege
- Carrier-facing layer does not expose backend spread/buy-rate tables

## Next Implementation Pass (Recommended)

- Add server-side CSV report exports
- Connect Supabase Realtime channels for live status updates
- Add broker verification email pipeline
- Add OCR extraction jobs + confidence scoring jobs
- Add partner routing automation service + override UI
- Add full audit log explorer drawer + filters

## Build Validation

- `npm run lint` passes
- `npm run build` passes
