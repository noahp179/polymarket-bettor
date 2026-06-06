export type Role = 'Platform Admin' | 'Tournament Organizer' | 'Participant';
export type Sport = 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'Soccer' | 'MMA' | 'Custom';
export type TournamentType = 'Pick’em' | 'Survivor Pool' | 'Confidence Pool' | 'Spread Betting' | 'Moneyline' | 'Custom';
export type TournamentStatus = 'Registration' | 'Live' | 'Completed' | 'Suspended';
export type CurrencyCode = 'USD' | 'CAD' | 'EUR';
export type PickStatus = 'Pending' | 'Won' | 'Lost' | 'Pushed';
export type ParticipantStatus = 'Active' | 'Eliminated';
export type DisputeStatus = 'Open' | 'Under Review' | 'Resolved';

export interface PrizeDistribution {
  label: string;
  percent: number;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  sport: Sport;
  type: TournamentType;
  visibility: 'Public' | 'Private';
  entryFee: number;
  currency: CurrencyCode;
  maxPlayers: number;
  minPlayers: number;
  participants: number;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  status: TournamentStatus;
  organizer: string;
  cover: string;
  prizeDistribution: PrizeDistribution[];
  complianceRegions: string[];
  ageVerifiedRequired: boolean;
  geoRestricted: boolean;
  rules: string;
  organizerId: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: Role;
  balance: number;
  createdAt: string;
}

export interface Participant {
  id: string;
  tournamentId: string;
  userId: string;
  username: string;
  joinedAt: string;
  status: ParticipantStatus;
}

export interface Pick {
  id: string;
  tournamentId: string;
  userId: string;
  event: string;
  selection: string;
  odds: string;
  stake: number;
  status: PickStatus;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  tournamentId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  tournamentId: string;
  userId: string;
  username: string;
  reason: string;
  status: DisputeStatus;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  record: string;
  profitLoss: number;
  points: number;
  roi: number;
}

export interface Transaction {
  id: string;
  kind: 'Entry Fee' | 'Payout' | 'Refund' | 'Platform Fee' | 'Withdrawal' | 'Deposit';
  tournament: string;
  amount: number;
  platformFee: number;
  status: 'Succeeded' | 'Pending' | 'Failed' | 'Scheduled';
  stripeId: string;
  date: string;
  userId: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  channel: 'Email' | 'In-app' | 'Push';
  status: 'Queued' | 'Sent' | 'Draft';
}

export interface SportsEvent {
  league: Sport;
  event: string;
  line: string;
  odds: string;
  score: string;
  source: string;
}

export interface CreateTournamentInput {
  name: string;
  description: string;
  sport: Sport;
  type: TournamentType;
  visibility: 'Public' | 'Private';
  entryFee: number;
  currency: CurrencyCode;
  maxPlayers: number;
  minPlayers: number;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  rules: string;
}

export interface ApiState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}
