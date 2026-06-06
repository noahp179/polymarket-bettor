import type { Dispute, ForumPost, Participant, Pick, SportsEvent, Tournament, Transaction, User } from '../domain/types';
import { initialTournaments } from '../data';

const STORAGE_KEY = 'longshots_data_v1';

export interface AppData {
  users: User[];
  tournaments: Tournament[];
  participants: Participant[];
  picks: Pick[];
  forumPosts: ForumPost[];
  disputes: Dispute[];
  transactions: Transaction[];
  notifications: { id: string; title: string; body: string; channel: 'Email' | 'In-app' | 'Push'; status: 'Queued' | 'Sent' | 'Draft' }[];
  sportsEvents: SportsEvent[];
}

function getDefaultData(): AppData {
  return {
    users: [
      { id: 'usr-001', email: 'admin@longshots.com', username: 'AdminUser', role: 'Platform Admin', balance: 5000, createdAt: '2026-01-01' },
      { id: 'usr-002', email: 'organizer@longshots.com', username: 'OrganizerPro', role: 'Tournament Organizer', balance: 2500, createdAt: '2026-02-15' },
      { id: 'usr-003', email: 'player@longshots.com', username: 'ValueHunter', role: 'Participant', balance: 1284, createdAt: '2026-03-10' },
      { id: 'usr-004', email: 'sharp@longshots.com', username: 'LineMover', role: 'Participant', balance: 890, createdAt: '2026-03-15' },
      { id: 'usr-005', email: 'ace@longshots.com', username: 'SharpSide', role: 'Participant', balance: 650, createdAt: '2026-04-01' },
    ],
    tournaments: initialTournaments.map((t) => ({ ...t, rules: t.rules || 'Standard rules apply.' })),
    participants: [
      { id: 'par-001', tournamentId: 'ls-nfl-001', userId: 'usr-003', username: 'ValueHunter', joinedAt: '2026-06-01', status: 'Active' },
      { id: 'par-002', tournamentId: 'ls-nfl-001', userId: 'usr-004', username: 'LineMover', joinedAt: '2026-06-01', status: 'Active' },
      { id: 'par-003', tournamentId: 'ls-nfl-001', userId: 'usr-005', username: 'SharpSide', joinedAt: '2026-06-01', status: 'Active' },
      { id: 'par-004', tournamentId: 'ls-nba-002', userId: 'usr-003', username: 'ValueHunter', joinedAt: '2025-10-15', status: 'Active' },
      { id: 'par-005', tournamentId: 'ls-mlb-003', userId: 'usr-004', username: 'LineMover', joinedAt: '2026-06-02', status: 'Active' },
      { id: 'par-006', tournamentId: 'ls-mlb-003', userId: 'usr-005', username: 'SharpSide', joinedAt: '2026-06-02', status: 'Active' },
    ],
    picks: [
      { id: 'pick-001', tournamentId: 'ls-nfl-001', userId: 'usr-003', event: 'DAL @ PHI', selection: 'PHI -3.5', odds: '-110', stake: 50, status: 'Pending', createdAt: '2026-06-01' },
      { id: 'pick-002', tournamentId: 'ls-nfl-001', userId: 'usr-004', event: 'KC @ BUF', selection: 'KC +2.5', odds: '-105', stake: 50, status: 'Pending', createdAt: '2026-06-01' },
      { id: 'pick-003', tournamentId: 'ls-nfl-001', userId: 'usr-005', event: 'DAL @ PHI', selection: 'DAL +3.5', odds: '+110', stake: 50, status: 'Pending', createdAt: '2026-06-01' },
      { id: 'pick-004', tournamentId: 'ls-nba-002', userId: 'usr-003', event: 'BOS @ NYK', selection: 'NYK +2.0', odds: '+102', stake: 25, status: 'Won', createdAt: '2026-01-15' },
      { id: 'pick-005', tournamentId: 'ls-mlb-003', userId: 'usr-004', event: 'LAD @ SF', selection: 'LAD ML', odds: '-135', stake: 15, status: 'Pending', createdAt: '2026-06-02' },
    ],
    forumPosts: [
      { id: 'fp-001', tournamentId: 'ls-nfl-001', userId: 'usr-003', username: 'ValueHunter', content: 'Looking forward to this week’s slate!', createdAt: '2026-06-01' },
      { id: 'fp-002', tournamentId: 'ls-nfl-001', userId: 'usr-004', username: 'LineMover', content: 'Eagles should cover easily.', createdAt: '2026-06-01' },
    ],
    disputes: [
      { id: 'disp-001', tournamentId: 'ls-nba-002', userId: 'usr-003', username: 'ValueHunter', reason: 'Incorrect score settlement for BOS @ NYK', status: 'Open', createdAt: '2026-06-01' },
    ],
    transactions: [
      { id: 'pay_001', kind: 'Entry Fee', tournament: 'Sunday Gridiron High Roller', amount: 50, platformFee: 2.5, status: 'Succeeded', stripeId: 'pi_mock_91Ka', date: '2026-06-01', userId: 'usr-003' },
      { id: 'fee_001', kind: 'Platform Fee', tournament: 'Diamond Moneyline Sprint', amount: 148.5, platformFee: 148.5, status: 'Succeeded', stripeId: 'txn_mock_platform', date: '2026-06-02', userId: 'usr-002' },
      { id: 'po_001', kind: 'Payout', tournament: 'Spring Survivor Pool', amount: 940, platformFee: 0, status: 'Scheduled', stripeId: 'po_mock_488', date: '2026-06-05', userId: 'usr-003' },
      { id: 'wd_001', kind: 'Withdrawal', tournament: 'Wallet', amount: 250, platformFee: 0, status: 'Pending', stripeId: 'tr_mock_31p', date: '2026-06-03', userId: 'usr-003' },
    ],
    notifications: [
      { id: 'n1', title: 'Invite accepted', body: 'Maya joined Sunday Gridiron through your referral link.', channel: 'In-app', status: 'Sent' },
      { id: 'n2', title: 'Pick deadline approaching', body: 'NBA confidence picks lock in 45 minutes.', channel: 'Push', status: 'Queued' },
      { id: 'n3', title: 'Payment receipt', body: 'Stripe receipt ready for your entry fee payment.', channel: 'Email', status: 'Sent' },
    ],
    sportsEvents: [
      { league: 'NFL', event: 'DAL @ PHI', line: 'PHI -3.5', odds: '-110', score: 'Scheduled', source: 'The Odds API adapter' },
      { league: 'NBA', event: 'BOS @ NYK', line: 'NYK +2.0', odds: '+102', score: '4Q 88-91', source: 'ESPN/Sportradar adapter' },
      { league: 'MLB', event: 'LAD @ SF', line: 'LAD ML', odds: '-135', score: 'Top 7, 4-2', source: 'SportsDataIO adapter' },
    ],
  };
}

export function getData(): AppData {
  if (typeof window === 'undefined') return getDefaultData();
  const raw = localStorage.getItem(STORAGE_KEY);
  let data: AppData;
  if (!raw) {
    data = getDefaultData();
  } else {
    data = JSON.parse(raw);
    // Ensure demo accounts always exist even if localStorage was corrupted
    const defaults = getDefaultData();
    for (const seedUser of defaults.users) {
      if (!data.users.some((u) => u.email.toLowerCase() === seedUser.email.toLowerCase())) {
        data.users.push(seedUser);
      }
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function setData(data: AppData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}
