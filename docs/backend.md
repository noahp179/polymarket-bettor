# TournamentBet Backend Integration

TournamentBet now includes a Supabase backend migration and a frontend data layer that uses Supabase REST when the project URL and anon key are configured.

## Supabase project

- Project URL: `https://remheocuxppurvkwkfoe.supabase.co`
- Project ref: `remheocuxppurvkwkfoe`
- Public anon key is configured in `.env.example` and as the frontend fallback in `src/config/env.ts`.

## What the migration creates

The migration at `supabase/migrations/20260603220000_initial_tournamentbet_schema.sql` creates:

- `profiles`
- `tournaments`
- `participants`
- `picks`
- `transactions`
- `payouts`
- `invitations`
- `notifications`
- `sports_events`
- `leaderboard_entries`
- `reports`
- `audit_logs`
- `platform_settings`
- `tournament_lobby` view
- `calculate_tournament_prize_pool()` function
- MVP row-level security policies
- Seed data for the current frontend lobby
- Storage buckets for avatars, tournament covers, receipts, and dispute evidence

## Apply the migration

The Supabase CLI is not installed in this container, and the provided anon key cannot execute DDL. Apply the migration one of these ways:

### Option 1: Supabase SQL editor

1. Open your Supabase project dashboard.
2. Go to **SQL Editor**.
3. Paste the contents of `supabase/migrations/20260603220000_initial_tournamentbet_schema.sql`.
4. Run the SQL.

### Option 2: Supabase CLI locally

```bash
supabase login
supabase link --project-ref remheocuxppurvkwkfoe
supabase db push
```

## Frontend data flow

`src/lib/mockApi.ts` now attempts Supabase first. If Supabase is unreachable or the migration has not been applied yet, it falls back to seeded mock data so the UI remains usable during setup.

- Reads: `tournament_lobby`, `leaderboard_entries`, `transactions`, `notifications`, `sports_events`
- Writes: `tournaments` insert from the create tournament modal

## Production hardening after Auth is enabled

The migration uses permissive MVP policies because Auth is currently not enabled. Before a real-money launch:

1. Enable Supabase Auth and Google OAuth.
2. Link `profiles.id` to `auth.users.id`.
3. Replace anonymous insert policies with authenticated organizer/admin policies.
4. Restrict transactions, payouts, reports, audit logs, and private tournaments by role.
5. Move Stripe webhook handling to server-side functions using service-role credentials.
