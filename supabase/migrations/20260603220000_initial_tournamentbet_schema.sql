-- TournamentBet Supabase schema
-- Apply with: supabase db push, or paste into the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  email text unique,
  avatar_url text,
  role text not null default 'Participant' check (role in ('Platform Admin', 'Tournament Organizer', 'Participant')),
  status text not null default 'active' check (status in ('active', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references public.profiles(id) on delete set null,
  organizer_name text not null default 'TournamentBet Organizer',
  name text not null,
  description text not null,
  sport text not null check (sport in ('NFL', 'NBA', 'MLB', 'NHL', 'Soccer', 'MMA', 'Custom')),
  tournament_type text not null check (tournament_type in ('Pick’em', 'Survivor Pool', 'Confidence Pool', 'Spread Betting', 'Moneyline', 'Custom')),
  visibility text not null default 'Public' check (visibility in ('Public', 'Private')),
  entry_fee numeric(12,2) not null default 0 check (entry_fee >= 0),
  currency text not null default 'USD' check (currency in ('USD', 'CAD', 'EUR')),
  max_players integer not null check (max_players >= 2),
  min_players integer not null check (min_players >= 2),
  registration_deadline date not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'Registration' check (status in ('Registration', 'Live', 'Completed', 'Suspended')),
  cover text not null default 'linear-gradient(135deg, #1493ff, #07111f 65%)',
  rules text not null default '',
  prize_distribution jsonb not null default '[{"label":"1st","percent":60},{"label":"2nd","percent":25},{"label":"3rd","percent":15}]'::jsonb,
  compliance_regions text[] not null default array['Pending compliance review'],
  age_verified_required boolean not null default true,
  geo_restricted boolean not null default true,
  platform_fee_rate numeric(5,4) not null default 0.05,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tournament_dates_valid check (registration_deadline <= start_date and start_date <= end_date),
  constraint tournament_min_max_valid check (min_players <= max_players)
);

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  username text not null default 'Guest Participant',
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected', 'withdrawn')),
  joined_at timestamptz not null default now(),
  unique (tournament_id, user_id)
);

create table if not exists public.picks (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  event_id text not null,
  pick text not null,
  odds text not null,
  stake numeric(12,2) not null default 100,
  result text not null default 'pending' check (result in ('pending', 'won', 'lost', 'push', 'void')),
  profit_loss numeric(12,2) not null default 0,
  points integer not null default 0,
  locked_at timestamptz,
  settled_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  tournament_id uuid references public.tournaments(id) on delete set null,
  kind text not null check (kind in ('Entry Fee', 'Payout', 'Refund', 'Platform Fee', 'Withdrawal', 'Deposit')),
  tournament_name text not null default 'Wallet',
  amount numeric(12,2) not null default 0,
  platform_fee numeric(12,2) not null default 0,
  stripe_id text not null default 'pending',
  status text not null default 'Pending' check (status in ('Succeeded', 'Pending', 'Failed', 'Scheduled')),
  created_at timestamptz not null default now()
);

create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  recipient_id uuid references public.profiles(id) on delete set null,
  amount numeric(12,2) not null check (amount >= 0),
  payout_status text not null default 'Scheduled' check (payout_status in ('Scheduled', 'Pending', 'Succeeded', 'Failed')),
  stripe_payout_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  inviter_id uuid references public.profiles(id) on delete set null,
  invite_code text not null unique,
  email text,
  accepted boolean not null default false,
  accepted_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  channel text not null check (channel in ('Email', 'In-app', 'Push')),
  status text not null default 'Queued' check (status in ('Queued', 'Sent', 'Draft')),
  created_at timestamptz not null default now()
);

create table if not exists public.sports_events (
  id uuid primary key default gen_random_uuid(),
  league text not null check (league in ('NFL', 'NBA', 'MLB', 'NHL', 'Soccer', 'MMA', 'Custom')),
  event text not null,
  line text not null,
  odds text not null,
  score text not null default 'Scheduled',
  source text not null default 'Manual adapter',
  starts_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references public.tournaments(id) on delete cascade,
  username text not null,
  rank integer not null,
  record text not null default '0-0',
  profit_loss numeric(12,2) not null default 0,
  points integer not null default 0,
  roi numeric(8,2) not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  subject_type text not null check (subject_type in ('user', 'tournament', 'payment', 'pick')),
  subject_id uuid,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.platform_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles for each row execute function public.touch_updated_at();

drop trigger if exists tournaments_touch_updated_at on public.tournaments;
create trigger tournaments_touch_updated_at before update on public.tournaments for each row execute function public.touch_updated_at();

create or replace view public.tournament_lobby as
select
  t.*,
  greatest(0, count(p.id) filter (where p.status = 'approved'))::integer as participants_count
from public.tournaments t
left join public.participants p on p.tournament_id = t.id
group by t.id;

create or replace function public.calculate_tournament_prize_pool(target_tournament_id uuid)
returns table(gross numeric, platform_fee numeric, net numeric)
language sql
stable
as $$
  select
    t.entry_fee * greatest(0, count(p.id) filter (where p.status = 'approved')) as gross,
    round((t.entry_fee * greatest(0, count(p.id) filter (where p.status = 'approved'))) * t.platform_fee_rate, 2) as platform_fee,
    round((t.entry_fee * greatest(0, count(p.id) filter (where p.status = 'approved'))) * (1 - t.platform_fee_rate), 2) as net
  from public.tournaments t
  left join public.participants p on p.tournament_id = t.id
  where t.id = target_tournament_id
  group by t.id;
$$;

alter table public.profiles enable row level security;
alter table public.tournaments enable row level security;
alter table public.participants enable row level security;
alter table public.picks enable row level security;
alter table public.transactions enable row level security;
alter table public.payouts enable row level security;
alter table public.invitations enable row level security;
alter table public.notifications enable row level security;
alter table public.sports_events enable row level security;
alter table public.leaderboard_entries enable row level security;
alter table public.reports enable row level security;
alter table public.audit_logs enable row level security;
alter table public.platform_settings enable row level security;

-- MVP policies: public read for lobby/demo data, public inserts for draft tournament creation.
-- Tighten these policies once Supabase Auth is enabled.
do $$
declare
  table_name text;
begin
  foreach table_name in array array['profiles','tournaments','participants','sports_events','leaderboard_entries','notifications','transactions','platform_settings'] loop
    execute format('drop policy if exists "%s_public_read" on public.%I', table_name, table_name);
    execute format('create policy "%s_public_read" on public.%I for select using (true)', table_name, table_name);
  end loop;
end $$;

drop policy if exists "tournaments_anon_insert" on public.tournaments;
create policy "tournaments_anon_insert" on public.tournaments for insert with check (true);

drop policy if exists "participants_anon_insert" on public.participants;
create policy "participants_anon_insert" on public.participants for insert with check (true);

drop policy if exists "reports_anon_insert" on public.reports;
create policy "reports_anon_insert" on public.reports for insert with check (true);

insert into public.profiles (id, username, email, role) values
  ('00000000-0000-0000-0000-000000000001', 'Gridiron Labs', 'gridiron@example.com', 'Tournament Organizer'),
  ('00000000-0000-0000-0000-000000000002', 'Downtown Hoops', 'hoops@example.com', 'Tournament Organizer'),
  ('00000000-0000-0000-0000-000000000003', 'Analytics Edge', 'analytics@example.com', 'Tournament Organizer')
on conflict (id) do nothing;

insert into public.tournaments (id, organizer_id, organizer_name, name, description, sport, tournament_type, visibility, entry_fee, currency, max_players, min_players, registration_deadline, start_date, end_date, status, cover, prize_distribution, compliance_regions) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Gridiron Labs', 'Sunday Gridiron High Roller', 'Weekly NFL spread contest with automated scoring, transparent prize math, and live leaderboard updates.', 'NFL', 'Spread Betting', 'Public', 50, 'USD', 100, 20, '2026-09-12', '2026-09-13', '2026-09-14', 'Registration', 'linear-gradient(135deg, #1493ff, #07111f 65%)', '[{"label":"1st","percent":60},{"label":"2nd","percent":25},{"label":"3rd","percent":15}]', array['US-CO','US-NJ','US-TN']),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Downtown Hoops', 'Courtside Confidence Cup', 'Rank NBA picks by confidence points and climb a real-time standings board as games settle.', 'NBA', 'Confidence Pool', 'Private', 25, 'USD', 64, 8, '2026-10-20', '2026-10-21', '2026-10-28', 'Registration', 'linear-gradient(135deg, #0b5bd3, #101a38 70%)', '[{"label":"Winner","percent":100}]', array['Configured per invite']),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Analytics Edge', 'Diamond Moneyline Sprint', 'MLB moneyline competition with ROI-first rankings, referrals, and payout automation hooks.', 'MLB', 'Moneyline', 'Public', 15, 'USD', 250, 25, '2026-06-11', '2026-06-12', '2026-06-19', 'Live', 'linear-gradient(135deg, #00c875, #0d1b2f 70%)', '[{"label":"1st","percent":50},{"label":"2nd","percent":30},{"label":"3rd","percent":20}]', array['US-AZ','US-IL','US-VA'])
on conflict (id) do nothing;

insert into public.participants (tournament_id, username, status)
select '10000000-0000-0000-0000-000000000001', 'Participant ' || generate_series, 'approved' from generate_series(1, 86)
on conflict do nothing;
insert into public.participants (tournament_id, username, status)
select '10000000-0000-0000-0000-000000000002', 'Hoops Player ' || generate_series, 'approved' from generate_series(1, 41)
on conflict do nothing;
insert into public.participants (tournament_id, username, status)
select '10000000-0000-0000-0000-000000000003', 'Diamond Player ' || generate_series, 'approved' from generate_series(1, 198)
on conflict do nothing;

insert into public.leaderboard_entries (tournament_id, username, rank, record, profit_loss, points, roi) values
  ('10000000-0000-0000-0000-000000000003', 'ValueHunter', 1, '18-7', 1420, 183, 31.8),
  ('10000000-0000-0000-0000-000000000003', 'LineMover', 2, '17-8', 1090, 171, 24.4),
  ('10000000-0000-0000-0000-000000000003', 'SharpSide', 3, '16-9', 820, 162, 19.2),
  ('10000000-0000-0000-0000-000000000003', 'PickPilot', 4, '15-10', 510, 147, 11.7),
  ('10000000-0000-0000-0000-000000000003', 'UnderdogAce', 5, '14-11', 260, 139, 7.5)
on conflict do nothing;

insert into public.transactions (kind, tournament_name, amount, platform_fee, status, stripe_id, created_at) values
  ('Entry Fee', 'Sunday Gridiron High Roller', 50, 2.5, 'Succeeded', 'pi_mock_91Ka', '2026-06-01'),
  ('Platform Fee', 'Diamond Moneyline Sprint', 148.5, 148.5, 'Succeeded', 'txn_mock_platform', '2026-06-02'),
  ('Payout', 'Spring Survivor Pool', 940, 0, 'Scheduled', 'po_mock_488', '2026-06-05'),
  ('Withdrawal', 'Wallet', 250, 0, 'Pending', 'tr_mock_31p', '2026-06-03')
on conflict do nothing;

insert into public.notifications (title, body, channel, status) values
  ('Invite accepted', 'Maya joined Sunday Gridiron through your referral link.', 'In-app', 'Sent'),
  ('Pick deadline approaching', 'NBA confidence picks lock in 45 minutes.', 'Push', 'Queued'),
  ('Payment receipt', 'Stripe receipt ready for your entry fee payment.', 'Email', 'Sent')
on conflict do nothing;

insert into public.sports_events (league, event, line, odds, score, source) values
  ('NFL', 'DAL @ PHI', 'PHI -3.5', '-110', 'Scheduled', 'The Odds API adapter'),
  ('NBA', 'BOS @ NYK', 'NYK +2.0', '+102', '4Q 88-91', 'ESPN/Sportradar adapter'),
  ('MLB', 'LAD @ SF', 'LAD ML', '-135', 'Top 7, 4-2', 'SportsDataIO adapter')
on conflict do nothing;

insert into public.platform_settings (key, value) values
  ('platform_fee_rate', '{"rate":0.05,"label":"5% platform fee"}'::jsonb),
  ('compliance_mode', '{"real_money_enabled":false,"requires_age_verification":true,"requires_geo_check":true}'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

-- Storage buckets for future auth-enabled uploads. Public read is enabled for MVP cover/avatar display.
do $$
begin
  if exists (select 1 from information_schema.schemata where schema_name = 'storage') then
    insert into storage.buckets (id, name, public) values
      ('avatars', 'avatars', true),
      ('tournament-covers', 'tournament-covers', true),
      ('receipts', 'receipts', false),
      ('dispute-evidence', 'dispute-evidence', false)
    on conflict (id) do update set public = excluded.public;
  end if;
end $$;
