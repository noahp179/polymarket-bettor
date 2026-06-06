import type { CreateTournamentInput, Tournament, Participant, Pick, ForumPost, LeaderboardEntry } from '../domain/types';
import type { AuthenticatedUser } from './auth';
import { getData, setData } from './persistence';

export async function getTournamentById(id: string): Promise<Tournament | undefined> {
  await new Promise((r) => setTimeout(r, 150));
  const data = getData();
  return data.tournaments.find((t) => t.id === id);
}

export async function getParticipants(tournamentId: string): Promise<Participant[]> {
  await new Promise((r) => setTimeout(r, 150));
  const data = getData();
  return data.participants.filter((p) => p.tournamentId === tournamentId);
}

export async function getPicks(tournamentId: string, userId?: string): Promise<Pick[]> {
  await new Promise((r) => setTimeout(r, 150));
  const data = getData();
  return data.picks.filter((p) => p.tournamentId === tournamentId && (!userId || p.userId === userId));
}

export async function getForumPosts(tournamentId: string): Promise<ForumPost[]> {
  await new Promise((r) => setTimeout(r, 150));
  const data = getData();
  return data.forumPosts.filter((f) => f.tournamentId === tournamentId);
}

export async function isUserInTournament(tournamentId: string, userId: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 100));
  const data = getData();
  return data.participants.some((p) => p.tournamentId === tournamentId && p.userId === userId);
}

export async function joinTournament(tournamentId: string, userId: string, username: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 350));
  const data = getData();
  const tournament = data.tournaments.find((t) => t.id === tournamentId);
  if (!tournament) throw new Error('Tournament not found');
  if (tournament.status !== 'Registration') throw new Error('Registration is closed for this tournament');
  if (data.participants.some((p) => p.tournamentId === tournamentId && p.userId === userId)) {
    throw new Error('You are already in this tournament');
  }
  if (tournament.participants >= tournament.maxPlayers) {
    throw new Error('This tournament is full');
  }

  data.participants.push({
    id: `par-${Date.now()}`,
    tournamentId,
    userId,
    username,
    joinedAt: new Date().toISOString().slice(0, 10),
    status: 'Active',
  });
  tournament.participants += 1;
  setData(data);
}

export async function submitPick(
  tournamentId: string,
  userId: string,
  event: string,
  selection: string,
  odds: string,
  stake: number
): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
  const data = getData();
  const tournament = data.tournaments.find((t) => t.id === tournamentId);
  if (!tournament) throw new Error('Tournament not found');
  if (tournament.status === 'Completed') throw new Error('Tournament is completed');

  data.picks.push({
    id: `pick-${Date.now()}`,
    tournamentId,
    userId,
    event,
    selection,
    odds,
    stake,
    status: 'Pending',
    createdAt: new Date().toISOString().slice(0, 10),
  });
  setData(data);
}

export async function addForumPost(tournamentId: string, userId: string, username: string, content: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  const data = getData();
  data.forumPosts.push({
    id: `fp-${Date.now()}`,
    tournamentId,
    userId,
    username,
    content,
    createdAt: new Date().toISOString().slice(0, 10),
  });
  setData(data);
}

export async function getTournamentLeaderboard(tournamentId: string): Promise<LeaderboardEntry[]> {
  await new Promise((r) => setTimeout(r, 150));
  const data = getData();
  const tournament = data.tournaments.find((t) => t.id === tournamentId);
  if (!tournament) return [];

  // Build leaderboard from participants and their picks
  const participants = data.participants.filter((p) => p.tournamentId === tournamentId);
  const picks = data.picks.filter((p) => p.tournamentId === tournamentId);

  const entries = participants.map((participant) => {
    const userPicks = picks.filter((p) => p.userId === participant.userId);
    const wins = userPicks.filter((p) => p.status === 'Won').length;
    const losses = userPicks.filter((p) => p.status === 'Lost').length;
    const pending = userPicks.filter((p) => p.status === 'Pending').length;
    const profitLoss = userPicks.reduce((acc, p) => {
      if (p.status === 'Won') return acc + p.stake * 1.5;
      if (p.status === 'Lost') return acc - p.stake;
      return acc;
    }, 0);
    const points = wins * 3 + pending;
    const total = wins + losses;
    const roi = total > 0 ? Math.round((profitLoss / (total * tournament.entryFee)) * 1000) / 10 : 0;

    return {
      rank: 0,
      username: participant.username,
      userId: participant.userId,
      record: `${wins}-${losses}`,
      wins,
      losses,
      pending,
      profitLoss: Math.round(profitLoss * 100) / 100,
      points,
      roi,
    };
  });

  // Sort by points (desc), then profitLoss (desc), then ROI (desc)
  entries.sort((a, b) => b.points - a.points || b.profitLoss - a.profitLoss || b.roi - a.roi);
  entries.forEach((entry, i) => { entry.rank = i + 1; });

  return entries.map(({ userId, wins, losses, pending, ...rest }) => rest);
}

export async function getUserPicksForTournament(tournamentId: string, userId: string): Promise<Pick[]> {
  await new Promise((r) => setTimeout(r, 100));
  const data = getData();
  return data.picks.filter((p) => p.tournamentId === tournamentId && p.userId === userId);
}

export async function createTournament(input: CreateTournamentInput, user: AuthenticatedUser | null): Promise<Tournament> {
  await new Promise((r) => setTimeout(r, 400));
  const data = getData();
  const newTournament: Tournament = {
    id: `tb-${Date.now()}`,
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
    organizer: user?.username ?? 'You',
    cover: 'linear-gradient(135deg, #1493ff, #07111f 65%)',
    prizeDistribution: [
      { label: '1st', percent: 60 },
      { label: '2nd', percent: 25 },
      { label: '3rd', percent: 15 },
    ],
    complianceRegions: ['Pending compliance review'],
    ageVerifiedRequired: true,
    geoRestricted: true,
    rules: input.rules,
    organizerId: user?.id ?? 'unknown',
  };
  data.tournaments.push(newTournament);
  setData(data);
  return newTournament;
}
