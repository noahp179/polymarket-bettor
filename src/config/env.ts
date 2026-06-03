const rawFeeRate = Number(import.meta.env.VITE_PLATFORM_FEE_RATE ?? '0.05');

export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'TournamentBet',
  platformFeeRate: Number.isFinite(rawFeeRate) ? rawFeeRate : 0.05,
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  sportsDataProvider: import.meta.env.VITE_SPORTS_DATA_PROVIDER ?? 'mock',
  googleOAuthClientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID ?? '',
};

export function getMissingIntegrationKeys() {
  const required = [
    ['Stripe publishable key', env.stripePublishableKey],
    ['Supabase URL', env.supabaseUrl],
    ['Supabase anon key', env.supabaseAnonKey],
    ['Google OAuth client ID', env.googleOAuthClientId],
  ] as const;

  return required.filter(([, value]) => !value || value.includes('replace') || value.includes('test_replace')).map(([label]) => label);
}
