import type { LeaderboardEntry, NotificationItem, SportsEvent, Tournament, Transaction } from './domain/types';

export const PLATFORM_FEE_RATE = 0.05;

export const tournaments: Tournament[] = [
  {
    id: 'tb-nfl-001',
    name: 'Sunday Gridiron High Roller',
    description: 'Weekly NFL spread contest with automated scoring, transparent prize math, and live leaderboard updates.',
    sport: 'NFL',
    type: 'Spread Betting',
    visibility: 'Public',
    entryFee: 50,
    currency: 'USD',
    maxPlayers: 100,
    minPlayers: 20,
    participants: 86,
    startDate: '2026-09-13',
    endDate: '2026-09-14',
    registrationDeadline: '2026-09-12',
    status: 'Registration',
    organizer: 'Gridiron Labs',
    cover: 'linear-gradient(135deg, #10b981, #0f172a 60%)',
    prizeDistribution: [
      { label: '1st', percent: 60 },
      { label: '2nd', percent: 25 },
      { label: '3rd', percent: 15 },
    ],
    complianceRegions: ['US-CO', 'US-NJ', 'US-TN'],
    ageVerifiedRequired: true,
    geoRestricted: true,
  },
  {
    id: 'tb-nba-002',
    name: 'Courtside Confidence Cup',
    description: 'Rank NBA picks by confidence points and climb a real-time standings board as games settle.',
    sport: 'NBA',
    type: 'Confidence Pool',
    visibility: 'Private',
    entryFee: 25,
    currency: 'USD',
    maxPlayers: 64,
    minPlayers: 8,
    participants: 41,
    startDate: '2026-10-21',
    endDate: '2026-10-28',
    registrationDeadline: '2026-10-20',
    status: 'Registration',
    organizer: 'Downtown Hoops',
    cover: 'linear-gradient(135deg, #f97316, #312e81 70%)',
    prizeDistribution: [{ label: 'Winner', percent: 100 }],
    complianceRegions: ['Configured per invite'],
    ageVerifiedRequired: true,
    geoRestricted: false,
  },
  {
    id: 'tb-mlb-003',
    name: 'Diamond Moneyline Sprint',
    description: 'MLB moneyline competition with ROI-first rankings, referrals, and payout automation hooks.',
    sport: 'MLB',
    type: 'Moneyline',
    visibility: 'Public',
    entryFee: 15,
    currency: 'USD',
    maxPlayers: 250,
    minPlayers: 25,
    participants: 198,
    startDate: '2026-06-12',
    endDate: '2026-06-19',
    registrationDeadline: '2026-06-11',
    status: 'Live',
    organizer: 'Analytics Edge',
    cover: 'linear-gradient(135deg, #38bdf8, #1e293b 70%)',
    prizeDistribution: [
      { label: '1st', percent: 50 },
      { label: '2nd', percent: 30 },
      { label: '3rd', percent: 20 },
    ],
    complianceRegions: ['US-AZ', 'US-IL', 'US-VA'],
    ageVerifiedRequired: true,
    geoRestricted: true,
  },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'ValueHunter', record: '18-7', profitLoss: 1420, points: 183, roi: 31.8 },
  { rank: 2, username: 'LineMover', record: '17-8', profitLoss: 1090, points: 171, roi: 24.4 },
  { rank: 3, username: 'SharpSide', record: '16-9', profitLoss: 820, points: 162, roi: 19.2 },
  { rank: 4, username: 'PickPilot', record: '15-10', profitLoss: 510, points: 147, roi: 11.7 },
  { rank: 5, username: 'UnderdogAce', record: '14-11', profitLoss: 260, points: 139, roi: 7.5 },
];

export const transactions: Transaction[] = [
  { id: 'pay_001', kind: 'Entry Fee', tournament: 'Sunday Gridiron High Roller', amount: 50, platformFee: 2.5, status: 'Succeeded', stripeId: 'pi_mock_91Ka', date: '2026-06-01' },
  { id: 'fee_001', kind: 'Platform Fee', tournament: 'Diamond Moneyline Sprint', amount: 148.5, platformFee: 148.5, status: 'Succeeded', stripeId: 'txn_mock_platform', date: '2026-06-02' },
  { id: 'po_001', kind: 'Payout', tournament: 'Spring Survivor Pool', amount: 940, platformFee: 0, status: 'Scheduled', stripeId: 'po_mock_488', date: '2026-06-05' },
  { id: 'wd_001', kind: 'Withdrawal', tournament: 'Wallet', amount: 250, platformFee: 0, status: 'Pending', stripeId: 'tr_mock_31p', date: '2026-06-03' },
];

export const notifications: NotificationItem[] = [
  { id: 'n1', title: 'Invite accepted', body: 'Maya joined Sunday Gridiron through your referral link.', channel: 'In-app', status: 'Sent' },
  { id: 'n2', title: 'Pick deadline approaching', body: 'NBA confidence picks lock in 45 minutes.', channel: 'Push', status: 'Queued' },
  { id: 'n3', title: 'Payment receipt', body: 'Stripe receipt ready for your entry fee payment.', channel: 'Email', status: 'Sent' },
];

export const analytics = [
  { month: 'Jan', revenue: 18000, users: 4200, volume: 360000 },
  { month: 'Feb', revenue: 22500, users: 5100, volume: 450000 },
  { month: 'Mar', revenue: 28800, users: 6800, volume: 576000 },
  { month: 'Apr', revenue: 33100, users: 7900, volume: 662000 },
  { month: 'May', revenue: 42800, users: 9400, volume: 856000 },
  { month: 'Jun', revenue: 51200, users: 11200, volume: 1024000 },
];

export const sportsEvents: SportsEvent[] = [
  { league: 'NFL', event: 'DAL @ PHI', line: 'PHI -3.5', odds: '-110', score: 'Scheduled', source: 'The Odds API adapter' },
  { league: 'NBA', event: 'BOS @ NYK', line: 'NYK +2.0', odds: '+102', score: '4Q 88-91', source: 'ESPN/Sportradar adapter' },
  { league: 'MLB', event: 'LAD @ SF', line: 'LAD ML', odds: '-135', score: 'Top 7, 4-2', source: 'SportsDataIO adapter' },
];
