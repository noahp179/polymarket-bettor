import { getData, setData } from './persistence';
import type { Tournament, User, Dispute } from '../domain/types';

export async function getAllUsers(): Promise<User[]> {
  await new Promise((r) => setTimeout(r, 200));
  return getData().users;
}

export async function getAllTournaments(): Promise<Tournament[]> {
  await new Promise((r) => setTimeout(r, 200));
  return getData().tournaments;
}

export async function getAllDisputes(): Promise<Dispute[]> {
  await new Promise((r) => setTimeout(r, 200));
  return getData().disputes;
}

export async function suspendTournament(tournamentId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 250));
  const data = getData();
  const t = data.tournaments.find((x) => x.id === tournamentId);
  if (!t) throw new Error('Tournament not found');
  t.status = 'Suspended';
  setData(data);
}

export async function unsuspendTournament(tournamentId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 250));
  const data = getData();
  const t = data.tournaments.find((x) => x.id === tournamentId);
  if (!t) throw new Error('Tournament not found');
  t.status = 'Registration';
  setData(data);
}

export async function resolveDispute(disputeId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 250));
  const data = getData();
  const d = data.disputes.find((x) => x.id === disputeId);
  if (!d) throw new Error('Dispute not found');
  d.status = 'Resolved';
  setData(data);
}
