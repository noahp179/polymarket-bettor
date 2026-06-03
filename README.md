# TournamentBet

TournamentBet is an MVP-ready React + TypeScript frontend for a sports betting tournament SaaS platform. This milestone intentionally keeps backend services mocked while providing production-oriented boundaries for Supabase Auth/PostgreSQL/Realtime/Storage, Stripe Connect, sports data providers, compliance controls, and role-based dashboards.

## What is now MVP-ready

- **Product shell:** Responsive landing page, navigation, dark/light mode, role preview, error boundary, loading/empty states, and environment integration banner.
- **Tournament discovery:** Search, sport filtering, public/private labels, invite URL previews, compliance flags, participant counts, entry fees, gross pot, 5% platform fee, and net prize pool.
- **Tournament creation:** Validated create modal for basic info, sport, tournament type, visibility, entry settings, min/max participants, timing, rules, prize math, and social sharing actions.
- **Participant dashboard:** Wallet summary, transaction states, referral stats, notifications, and realtime-style leaderboard contract.
- **Organizer/admin surfaces:** Admin controls, disabled-state RBAC preview, payment ledger, platform fee reporting, dispute/fraud actions, and CSV export affordance.
- **Sports data surface:** Live score, schedule, odds, and provider adapter placeholders for The Odds API, ESPN/Sportradar, or SportsDataIO.
- **Compliance architecture:** Age verification, geo-restrictions, responsible gaming, KYC hooks, audit logs, rules engine, and legal page placeholders are modeled as configurable UI modules.
- **Frontend integration seams:** Mock API and typed domain models can be replaced with Supabase queries, serverless functions, or a Node API without redesigning the UI.

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

## Production launch next steps

### 1. Supabase foundation

- Create Supabase project and configure `.env.local` from `.env.example`.
- Add Supabase Auth for email/password and Google OAuth.
- Create Postgres tables for profiles, tournaments, participants, picks, payments, payouts, invitations, notifications, disputes, reports, audit logs, sports events, wallets, and ledger entries.
- Enable RLS policies for Platform Admin, Tournament Organizer, and Participant roles.
- Add Supabase Storage buckets for avatars, tournament covers, receipts, and dispute evidence.

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
