import { leaderboard, notifications, sportsEvents, tournaments, transactions } from '../data';
import type { CreateTournamentInput, Tournament } from '../domain/types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loadDashboardData() {
  await wait(250);
  return { tournaments, leaderboard, transactions, notifications, sportsEvents };
}

export async function createTournament(input: CreateTournamentInput): Promise<Tournament> {
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
    cover: 'linear-gradient(135deg, #22c55e, #0f172a 65%)',
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
