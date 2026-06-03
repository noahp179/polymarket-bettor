import type { CreateTournamentInput } from '../domain/types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateTournament(input: CreateTournamentInput): ValidationResult {
  const errors: string[] = [];

  if (input.name.trim().length < 4) errors.push('Tournament name must be at least 4 characters.');
  if (input.description.trim().length < 20) errors.push('Description must explain the tournament in at least 20 characters.');
  if (input.entryFee < 0) errors.push('Entry fee cannot be negative.');
  if (input.maxPlayers < 2) errors.push('Maximum participants must be at least 2.');
  if (input.minPlayers < 2) errors.push('Minimum participants must be at least 2.');
  if (input.minPlayers > input.maxPlayers) errors.push('Minimum participants cannot exceed maximum participants.');
  if (!input.registrationDeadline || !input.startDate || !input.endDate) errors.push('Registration deadline, start date, and end date are required.');
  if (input.registrationDeadline && input.startDate && input.registrationDeadline > input.startDate) errors.push('Registration deadline must be before the start date.');
  if (input.startDate && input.endDate && input.startDate > input.endDate) errors.push('Start date must be before the end date.');
  if (input.rules.trim().length < 20) errors.push('Rules must include scoring, deadlines, tie-breakers, and refund terms.');

  return { valid: errors.length === 0, errors };
}
