import { getData, setData } from './persistence';
import type { Role, User } from '../domain/types';

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role: Role;
  balance: number;
}

const SESSION_KEY = 'longshots_session';

function getSession(): AuthenticatedUser | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setSession(user: AuthenticatedUser | null) {
  if (typeof window === 'undefined') return;
  if (user) sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else sessionStorage.removeItem(SESSION_KEY);
}

export async function login(email: string, password: string): Promise<AuthenticatedUser> {
  await new Promise((r) => setTimeout(r, 300));
  const data = getData();
  const found = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!found) throw new Error('Invalid credentials');
  const user: AuthenticatedUser = {
    id: found.id,
    email: found.email,
    username: found.username,
    role: found.role,
    balance: found.balance,
  };
  setSession(user);
  return user;
}

export async function register(email: string, password: string, username: string): Promise<AuthenticatedUser> {
  await new Promise((r) => setTimeout(r, 350));
  const data = getData();
  if (data.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists');
  }
  if (data.users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('Username is already taken');
  }
  const newUser: User = {
    id: `usr-${Date.now()}`,
    email,
    username,
    role: 'Participant',
    balance: 1000,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  data.users.push(newUser);
  setData(data);
  const user: AuthenticatedUser = {
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
    role: newUser.role,
    balance: newUser.balance,
  };
  setSession(user);
  return user;
}

export function logout() {
  setSession(null);
}

export function getCurrentUser(): AuthenticatedUser | null {
  return getSession();
}
