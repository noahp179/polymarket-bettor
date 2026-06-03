import { leaderboard, notifications, sportsEvents, tournaments, transactions } from '../data';
import type { CreateTournamentInput, Tournament } from '../domain/types';
import { createSupabaseTournament, isSupabaseConfigured, loadSupabaseDashboardData } from './supabaseRest';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loadDashboardData() {
  if (isSupabaseConfigured()) {
    try {
      return await loadSupabaseDashboardData();
    } catch (error) {
      console.warn('Falling back to mock TournamentBet data because Supabase failed to load.', error);
    }
  }

  await wait(250);
  return { tournaments, leaderboard, transactions, notifications, sportsEvents };
}

export async function createTournament(input: CreateTournamentInput): Promise<Tournament> {
  if (isSupabaseConfigured()) {
    try {
      return await createSupabaseTournament(input);
    } catch (error) {
      console.warn('Falling back to local draft tournament because Supabase insert failed.', error);
    }
  }

  await wait(350);

  return {
    id: `tb-draft-${Date.now()}`,
    name: input.name,
    description: input.description,
    sport: input.sport,
    type: input.type,
    visibility: input.visibility,
    entryFee: input.entryFee,
    currency: input.currency,
    maxPlayers: input.maxPlayers,
    minPlayers: input.minPlayers,
    participants: 1,
    registrationDeadline: input.registrationDeadline,
    startDate: input.startDate,
    endDate: input.endDate,
    status: 'Registration',
    organizer: 'You',
    cover: 'linear-gradient(135deg, #1493ff, #07111f 65%)',
    prizeDistribution: [
      { label: '1st', percent: 60 },
      { label: '2nd', percent: 25 },
      { label: '3rd', percent: 15 },
    ],
    complianceRegions: ['Pending compliance review'],
    ageVerifiedRequired: true,
    geoRestricted: true,
  };
}
