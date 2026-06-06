import { create } from 'zustand';
import type { LeaderboardEntry, NotificationItem, SportsEvent, Tournament, Transaction } from '../domain/types';
import * as authApi from '../lib/auth';
import * as tournamentApi from '../lib/tournamentApi';
import * as userApi from '../lib/userApi';
import * as adminApi from '../lib/adminApi';

export interface StoreState {
  user: authApi.AuthenticatedUser | null;
  tournaments: Tournament[];
  leaderboard: LeaderboardEntry[];
  transactions: Transaction[];
  notifications: NotificationItem[];
  sportsEvents: SportsEvent[];
  darkMode: boolean;
  loading: boolean;
  error: string | null;
}

export interface StoreActions {
  setUser: (user: authApi.AuthenticatedUser | null) => void;
  setDarkMode: (darkMode: boolean) => void;
  clearError: () => void;
  loadDashboard: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  createTournament: (input: import('../domain/types').CreateTournamentInput) => Promise<Tournament>;
  joinTournament: (tournamentId: string) => Promise<void>;
  submitPick: (tournamentId: string, event: string, selection: string, odds: string, stake: number) => Promise<void>;
  addForumPost: (tournamentId: string, content: string) => Promise<void>;
}

interface FullStore extends StoreState, StoreActions {}

export const useStore = create<FullStore>((set, get) => ({
  user: null,
  tournaments: [],
  leaderboard: [],
  transactions: [],
  notifications: [],
  sportsEvents: [],
  darkMode: true,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setDarkMode: (darkMode) => set({ darkMode }),
  clearError: () => set({ error: null }),

  loadDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const data = await userApi.loadDashboardData();
      set({
        tournaments: data.tournaments,
        leaderboard: data.leaderboard,
        transactions: data.transactions,
        notifications: data.notifications,
        sportsEvents: data.sportsEvents,
        loading: false,
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load dashboard', loading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const user = await authApi.login(email, password);
      set({ user, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Login failed', loading: false });
      throw err;
    }
  },

  register: async (email: string, password: string, username: string) => {
    set({ loading: true, error: null });
    try {
      const user = await authApi.register(email, password, username);
      set({ user, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Registration failed', loading: false });
      throw err;
    }
  },

  logout: () => {
    authApi.logout();
    set({ user: null });
  },

  createTournament: async (input) => {
    set({ loading: true, error: null });
    try {
      const tournament = await tournamentApi.createTournament(input, get().user);
      set((state) => ({ tournaments: [tournament, ...state.tournaments], loading: false }));
      return tournament;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create tournament', loading: false });
      throw err;
    }
  },

  joinTournament: async (tournamentId: string) => {
    const state = get();
    if (!state.user) throw new Error('You must be logged in to join a tournament');
    await tournamentApi.joinTournament(tournamentId, state.user.id, state.user.username);
    const updated = await userApi.loadDashboardData();
    set({ tournaments: updated.tournaments });
  },

  submitPick: async (tournamentId, event, selection, odds, stake) => {
    const state = get();
    if (!state.user) throw new Error('You must be logged in to submit a pick');
    await tournamentApi.submitPick(tournamentId, state.user.id, event, selection, odds, stake);
  },

  addForumPost: async (tournamentId, content) => {
    const state = get();
    if (!state.user) throw new Error('You must be logged in to post');
    await tournamentApi.addForumPost(tournamentId, state.user.id, state.user.username, content);
  },
}));
