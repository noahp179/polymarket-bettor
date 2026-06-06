import { useState, type FormEvent, useMemo } from 'react';
import type { CreateTournamentInput, Sport, Tournament, TournamentType } from '../domain/types';
import { calculatePrize, currency } from '../lib/finance';
import { validateTournament } from '../lib/validation';
import { Badge } from './ui';
import { createTournament } from '../lib/tournamentApi';
import { useStore } from '../store/useStore';

const sports: Sport[] = ['NFL', 'NBA', 'MLB', 'NHL', 'Soccer', 'MMA', 'Custom'];
const tournamentTypes: TournamentType[] = ['Pick’em', 'Survivor Pool', 'Confidence Pool', 'Spread Betting', 'Moneyline', 'Custom'];

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (tournament: Tournament) => void;
}

export function CreateTournamentModal({ open, onClose, onCreated }: Props) {
  const user = useStore((s) => s.user);
  const [form, setForm] = useState<CreateTournamentInput>({
    name: 'Sunday Gridiron High Roller',
    description: 'Weekly NFL spread contest with automated scoring and transparent prize math.',
    sport: 'NFL',
    type: 'Spread Betting',
    visibility: 'Public',
    entryFee: 50,
    currency: 'USD',
    maxPlayers: 100,
    minPlayers: 20,
    registrationDeadline: '2026-09-12',
    startDate: '2026-09-13',
    endDate: '2026-09-14',
    rules: 'Picks lock before kickoff. Standings are scored by profit/loss, then points, then earliest submission. Refunds only if minimum participants are not met.',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const prize = useMemo(() => calculatePrize(form.entryFee, form.maxPlayers), [form.entryFee, form.maxPlayers]);

  if (!open) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = validateTournament(form);
    setErrors(result.errors);
    if (!result.valid) return;
    setSaving(true);
    try {
      const tournament = await createTournament(form, user);
      onCreated(tournament);
      setSaving(false);
      onClose();
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Failed to create tournament']);
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Create tournament">
      <form className="modal-card sportsbook-panel" onSubmit={submit}>
        <div className="card-header"><h2>Create tournament</h2><button type="button" className="ghost-button" onClick={onClose}>Cancel</button></div>
        {errors.length > 0 && <div className="error-list" role="alert">{errors.map((error) => <p key={error}>{error}</p>)}</div>}
        <div className="form-grid">
          <label>Tournament name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Sport<select value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value as Sport })}>{sports.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TournamentType })}>{tournamentTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Visibility<select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as 'Public' | 'Private' })}><option>Public</option><option>Private</option></select></label>
          <label>Entry fee<input type="number" value={form.entryFee} min="0" onChange={(e) => setForm({ ...form, entryFee: Number(e.target.value) })} /></label>
          <label>Max participants<input type="number" value={form.maxPlayers} min="2" onChange={(e) => setForm({ ...form, maxPlayers: Number(e.target.value) })} /></label>
          <label>Min participants<input type="number" value={form.minPlayers} min="2" onChange={(e) => setForm({ ...form, minPlayers: Number(e.target.value) })} /></label>
          <label>Registration deadline<input type="date" value={form.registrationDeadline} onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })} /></label>
          <label>Start date<input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></label>
          <label>End date<input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></label>
          <label className="full">Rules<textarea value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} /></label>
        </div>
        <div className="fee-summary">
          <div><span>Gross pot</span><strong>{currency(prize.gross)}</strong></div>
          <div><span>Platform fee (5%)</span><strong>{currency(prize.fee)}</strong></div>
          <div><span>Available prize pool</span><strong>{currency(prize.net)}</strong></div>
        </div>
        {/* Removed social-row: Share to Facebook/X/WhatsApp/Discord/Telegram —
            non-functional decorative buttons that signal "AI generated feature list".
            Will be re-added when actual sharing integration exists. */}
        <button className="primary-button large full-width" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save draft tournament'}</button>
      </form>
    </div>
  );
}
