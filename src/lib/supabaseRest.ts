import { env } from '../config/env';
import type { CreateTournamentInput, LeaderboardEntry, NotificationItem, SportsEvent, Tournament, Transaction } from '../domain/types';

type JsonRecord = Record<string, unknown>;

export interface BackendData {
  tournaments: Tournament[];
  leaderboard: LeaderboardEntry[];
  transactions: Transaction[];
  notifications: NotificationItem[];
  sportsEvents: SportsEvent[];
}

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey && !env.supabaseUrl.includes('replace') && !env.supabaseAnonKey.includes('replace'));
}

async function supabaseFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const response = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: env.supabaseAnonKey,
      Authorization: `Bearer ${env.supabaseAnonKey}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${body}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback;
}

function mapPrizeDistribution(value: unknown): Tournament['prizeDistribution'] {
  if (!Array.isArray(value)) return [{ label: '1st', percent: 100 }];
  return value.map((item) => {
    const row = item as JsonRecord;
    return { label: asString(row.label, 'Place'), percent: asNumber(row.percent, 0) };
  });
}

function mapTournament(row: JsonRecord): Tournament {
  return {
    id: asString(row.id),
    name: asString(row.name),
    description: asString(row.description),
    sport: asString(row.sport, 'Custom') as Tournament['sport'],
    type: asString(row.tournament_type, 'Custom') as Tournament['type'],
    visibility: asString(row.visibility, 'Public') as Tournament['visibility'],
    entryFee: asNumber(row.entry_fee),
    currency: asString(row.currency, 'USD') as Tournament['currency'],
    maxPlayers: asNumber(row.max_players, 2),
    minPlayers: asNumber(row.min_players, 2),
    participants: asNumber(row.participants_count),
    registrationDeadline: asString(row.registration_deadline),
    startDate: asString(row.start_date),
    endDate: asString(row.end_date),
    status: asString(row.status, 'Registration') as Tournament['status'],
    organizer: asString(row.organizer_name, 'Longshots Organizer'),
    cover: asString(row.cover, 'linear-gradient(135deg, #1493ff, #07111f 65%)'),
    prizeDistribution: mapPrizeDistribution(row.prize_distribution),
    complianceRegions: Array.isArray(row.compliance_regions) ? row.compliance_regions.map((item) => String(item)) : ['Pending compliance review'],
    ageVerifiedRequired: asBoolean(row.age_verified_required, true),
    geoRestricted: asBoolean(row.geo_restricted, true),
    rules: asString(row.rules, ''),
    organizerId: asString(row.organizer_id, ''),
  };
}

function mapLeaderboard(row: JsonRecord): LeaderboardEntry {
  return {
    rank: asNumber(row.rank),
    username: asString(row.username),
    record: asString(row.record, '0-0'),
    profitLoss: asNumber(row.profit_loss),
    points: asNumber(row.points),
    roi: asNumber(row.roi),
  };
}

function mapTransaction(row: JsonRecord): Transaction {
  return {
    id: asString(row.id),
    kind: asString(row.kind, 'Deposit') as Transaction['kind'],
    tournament: asString(row.tournament_name, 'Wallet'),
    amount: asNumber(row.amount),
    platformFee: asNumber(row.platform_fee),
    stripeId: asString(row.stripe_id, 'pending'),
    status: asString(row.status, 'Pending') as Transaction['status'],
    date: asString(row.created_at).slice(0, 10),
    userId: asString(row.user_id, ''),
  };
}

function mapNotification(row: JsonRecord): NotificationItem {
  return {
    id: asString(row.id),
    title: asString(row.title),
    body: asString(row.body),
    channel: asString(row.channel, 'In-app') as NotificationItem['channel'],
    status: asString(row.status, 'Queued') as NotificationItem['status'],
  };
}

function mapSportsEvent(row: JsonRecord): SportsEvent {
  return {
    league: asString(row.league, 'Custom') as SportsEvent['league'],
    event: asString(row.event),
    line: asString(row.line),
    odds: asString(row.odds),
    score: asString(row.score, 'Scheduled'),
    source: asString(row.source, 'Supabase'),
  };
}

export async function loadSupabaseDashboardData(): Promise<BackendData> {
  const [tournamentRows, leaderboardRows, transactionRows, notificationRows, sportsEventRows] = await Promise.all([
    supabaseFetch<JsonRecord[]>('tournament_lobby?select=*&order=created_at.desc'),
    supabaseFetch<JsonRecord[]>('leaderboard_entries?select=*&order=rank.asc&limit=10'),
    supabaseFetch<JsonRecord[]>('transactions?select=*&order=created_at.desc&limit=20'),
    supabaseFetch<JsonRecord[]>('notifications?select=*&order=created_at.desc&limit=20'),
    supabaseFetch<JsonRecord[]>('sports_events?select=*&order=updated_at.desc&limit=20'),
  ]);

  return {
    tournaments: tournamentRows.map(mapTournament),
    leaderboard: leaderboardRows.map(mapLeaderboard),
    transactions: transactionRows.map(mapTransaction),
    notifications: notificationRows.map(mapNotification),
    sportsEvents: sportsEventRows.map(mapSportsEvent),
  };
}

export async function createSupabaseTournament(input: CreateTournamentInput): Promise<Tournament> {
  const [row] = await supabaseFetch<JsonRecord[]>('tournaments?select=*', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      organizer_name: 'You',
      name: input.name,
      description: input.description,
      sport: input.sport,
      tournament_type: input.type,
      visibility: input.visibility,
      entry_fee: input.entryFee,
      currency: input.currency,
      max_players: input.maxPlayers,
      min_players: input.minPlayers,
      registration_deadline: input.registrationDeadline,
      start_date: input.startDate,
      end_date: input.endDate,
      rules: input.rules,
      status: 'Registration',
      cover: 'linear-gradient(135deg, #1493ff, #07111f 65%)',
      prize_distribution: [
        { label: '1st', percent: 60 },
        { label: '2nd', percent: 25 },
        { label: '3rd', percent: 15 },
      ],
      compliance_regions: ['Pending compliance review'],
      age_verified_required: true,
      geo_restricted: true,
    }),
  });

  return mapTournament({ ...row, participants_count: 0 });
}
