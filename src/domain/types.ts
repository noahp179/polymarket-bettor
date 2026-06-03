export type Role = 'Platform Admin' | 'Tournament Organizer' | 'Participant';
export type Sport = 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'Soccer' | 'MMA' | 'Custom';
export type TournamentType = 'Pick’em' | 'Survivor Pool' | 'Confidence Pool' | 'Spread Betting' | 'Moneyline' | 'Custom';
export type TournamentStatus = 'Registration' | 'Live' | 'Completed' | 'Suspended';
export type CurrencyCode = 'USD' | 'CAD' | 'EUR';

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
