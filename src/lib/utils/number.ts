import {
  BASE_MULTIPLIER,
  MAX_ACTIVE_STAKE_LIMIT,
  MAX_LOCK_PERIOD,
  MAX_MULTIPLIER,
  MIN_LOCK_PERIOD,
  Stake,
} from '@/lib/const';
import { tokenToWei } from '@/utils/helpers';
import Decimal from 'decimal.js';

export function calculateMultiplier(
  lockPeriod: number,
  maxLockPeriod: number = MAX_LOCK_PERIOD
): number {
  return (
    BASE_MULTIPLIER +
    ((MAX_MULTIPLIER - BASE_MULTIPLIER) * (lockPeriod - MIN_LOCK_PERIOD)) /
      (maxLockPeriod - MIN_LOCK_PERIOD)
  );
}

export const calculateRewardLocal = (stake: Stake): string => {
  const lock = new Decimal(stake.lockPeriod.toString());
  const multiplier = new Decimal(calculateMultiplier(lock.toNumber()));

  return new Decimal(stake.amount.toString())
    .times(multiplier)
    .div(100)
    .toFixed(0);
};

export const getProgressPercentage = (
  startTimestamp: number,
  lockPeriod: number
): number => {
  const startMs = startTimestamp * 1000;
  const lockMs = lockPeriod * 1000;
  const elapsed = Date.now() - startMs;
  const percent = (elapsed / lockMs) * 100;
  return Math.max(0, Math.min(100, percent));
};

export const isReachedMaxActiveStakeLimit = (
  amount: string,
  totalActiveUserStake: bigint
): boolean => {
  const amountWei = tokenToWei(amount);
  const total = amountWei + totalActiveUserStake;

  return total > tokenToWei(MAX_ACTIVE_STAKE_LIMIT.toString());
};
