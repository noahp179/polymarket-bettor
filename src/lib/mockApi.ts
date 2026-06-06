import * as userApi from './userApi';
import * as tournamentApi from './tournamentApi';
import type { CreateTournamentInput, Tournament } from '../domain/types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loadDashboardData() {
  await wait(250);
  return userApi.loadDashboardData();
}

export async function createTournament(input: CreateTournamentInput): Promise<Tournament> {
  await wait(350);
  return tournamentApi.createTournament(input, null);
}
