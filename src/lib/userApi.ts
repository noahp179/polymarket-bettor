import { getData } from './persistence';
import type { BackendData } from './supabaseRest';

export async function loadDashboardData(): Promise<BackendData> {
  const data = getData();
  const { notifications, sportsEvents, transactions, users } = data;

  const leaderboard = [
    { rank: 1, username: 'ValueHunter', record: '18-7', profitLoss: 1420, points: 183, roi: 31.8 },
    { rank: 2, username: 'LineMover', record: '17-8', profitLoss: 1090, points: 171, roi: 24.4 },
    { rank: 3, username: 'SharpSide', record: '16-9', profitLoss: 820, points: 162, roi: 19.2 },
    { rank: 4, username: 'PickPilot', record: '15-10', profitLoss: 510, points: 147, roi: 11.7 },
    { rank: 5, username: 'UnderdogAce', record: '14-11', profitLoss: 260, points: 139, roi: 7.5 },
  ];

  const tournaments = data.tournaments.map((t) => ({ ...t }));

  return {
    tournaments,
    leaderboard,
    transactions: transactions.filter((t) => t.userId === '' || true),
    notifications,
    sportsEvents,
  };
}

export async function getUserTransactions(userId: string) {
  await new Promise((r) => setTimeout(r, 150));
  const data = getData();
  return data.transactions.filter((t) => t.userId === userId);
}

export async function getUserPicks(userId: string) {
  await new Promise((r) => setTimeout(r, 150));
  const data = getData();
  return data.picks.filter((p) => p.userId === userId);
}

export async function getUserTournaments(userId: string) {
  await new Promise((r) => setTimeout(r, 150));
  const data = getData();
  const participantIds = data.participants.filter((p) => p.userId === userId).map((p) => p.tournamentId);
  return data.tournaments.filter((t) => participantIds.includes(t.id));
}
