# TournamentBet

TournamentBet is an MVP-ready React + TypeScript application for a sports betting tournament SaaS platform. It now includes a Supabase schema migration, Supabase REST data layer, sportsbook-style frontend, and fallback mock data while Stripe Connect, sports provider APIs, and production Auth are finalized.

## What is now MVP-ready

- **Product shell:** Professional sportsbook-style landing page, compact sport navigation, live market board, ticket/entry preview, dark/light mode, role preview, error boundary, loading/empty states, and environment integration banner.
- **Tournament discovery:** Betting lobby cards with search, sport filtering, public/private labels, invite URL previews, compliance flags, field-fill progress, entry fees, gross pot, 5% platform fee, and net prize pool.
- **Tournament creation:** Validated create modal for basic info, sport, tournament type, visibility, entry settings, min/max participants, timing, rules, prize math, and social sharing actions.
- **Participant dashboard:** Wallet summary, transaction states, referral stats, notifications, and realtime-style leaderboard contract.
- **Organizer/admin surfaces:** Admin controls, disabled-state RBAC preview, payment ledger, platform fee reporting, dispute/fraud actions, and CSV export affordance.
- **Sports data surface:** Live score, schedule, odds, and provider adapter placeholders for The Odds API, ESPN/Sportradar, or SportsDataIO.
- **Compliance architecture:** Age verification, geo-restrictions, responsible gaming, KYC hooks, audit logs, rules engine, and legal page placeholders are modeled as configurable UI modules.
- **Supabase integration:** The frontend attempts Supabase REST reads/writes first and falls back to mock data until the migration is applied.

## Project structure

```text
src/
  App.tsx                    # Main MVP application composition
  main.tsx                   # React bootstrap + error boundary
  components/                # Reusable UI and error boundary components
  config/env.ts              # Frontend env parsing and integration readiness checks
  domain/types.ts            # TournamentBet domain contracts
  lib/finance.ts             # Platform fee, prize pool, and payout helpers
  lib/mockApi.ts             # Replaceable async mock API boundary
  lib/validation.ts          # Tournament creation validation
  data.ts                    # Seeded mock data for the MVP frontend
  styles.css                 # Responsive product styling
```

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

> Package installation requires npm registry access. In the current execution environment, registry requests returned HTTP 403, so install/build verification could not complete here.

## Supabase backend setup

The backend migration is in `supabase/migrations/20260603220000_initial_tournamentbet_schema.sql`. It creates the TournamentBet tables, seed data, RLS policies, storage buckets, `tournament_lobby` view, and prize pool function. More details are in `docs/backend.md`.

Apply it in the Supabase SQL editor or with the CLI:

```bash
supabase login
supabase link --project-ref remheocuxppurvkwkfoe
supabase db push
```

The frontend data layer in `src/lib/supabaseRest.ts` uses the configured Supabase project first, then falls back to mock data if the schema is not applied yet.

## Production launch next steps

### 1. Supabase foundation

- Apply the included Supabase migration to create the database foundation.
- Enable Supabase Auth for email/password and Google OAuth.
- Replace MVP anonymous policies with authenticated RLS policies for Platform Admin, Tournament Organizer, and Participant roles.
- Add server-side functions for Stripe webhooks, payouts, KYC, and sports-data ingestion.

### 2. Stripe Connect and wallet ledger

- Implement Stripe Connect account onboarding for payout recipients.
- Create checkout sessions for tournament entry fees.
- Verify Stripe webhooks server-side for payment success, failure, refund, dispute, transfer, and payout events.
- Store immutable wallet ledger entries for deposits, entry fees, platform fees, refunds, winnings, withdrawals, and payout status.
- Reconcile the 5% platform fee before distributing tournament winnings.

### 3. Realtime tournament engine

- Ingest sports schedules, odds, scores, and result feeds through provider adapters.
- Add queue jobs for score syncing, pick locking, pick settlement, leaderboard recalculation, notifications, and payout scheduling.
- Broadcast leaderboard updates through Supabase Realtime or WebSockets.
- Add idempotent settlement logic and audit logs for every scoring and payout event.

### 4. Compliance and legal controls

- Do not launch real-money contests until counsel reviews tournament mechanics, Terms, Privacy Policy, responsible gaming copy, and jurisdiction rules.
- Wire KYC/identity verification, age verification, geo-restriction checks, self-exclusion, deposit limits, and suspicious activity review.
- Keep eligibility, restricted jurisdictions, tournament rules, refund terms, and payout rules configurable instead of hardcoded.

### 5. MVP QA checklist

- Add unit tests for finance helpers, validation, and tournament state transitions.
- Add integration tests for auth, tournament creation, join/payment flow, pick submission, settlement, and payout flows.
- Add E2E tests for participant, organizer, and admin role journeys.
- Configure CI to run typecheck, build, lint, tests, dependency audit, and deployment preview.
- Add analytics events for discovery, invites, checkout conversion, tournament joins, pick submissions, and payouts.
