import { env } from '../config/env';
import type { CurrencyCode, PrizeDistribution } from '../domain/types';

export function currency(value: number, currencyCode: CurrencyCode = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, maximumFractionDigits: 0 }).format(value);
}

export function calculatePrize(entryFee: number, participants: number, feeRate = env.platformFeeRate) {
  const gross = Math.max(0, entryFee) * Math.max(0, participants);
  const fee = Math.round(gross * feeRate * 100) / 100;
  return { gross, fee, net: gross - fee };
}

export function calculatePayouts(netPrizePool: number, distribution: PrizeDistribution[]) {
  return distribution.map((payout) => ({
    ...payout,
    amount: Math.round(netPrizePool * (payout.percent / 100) * 100) / 100,
  }));
}
