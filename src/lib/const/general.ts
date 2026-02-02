import { mainnet, sepolia } from 'wagmi/chains';
import { TOKEN } from './token';

export const SITE_NAME = 'GOC Staking';
export const SITE_DESCRIPTION =
  'Leading Sports Apparel Brands Embrace Crypto-Tech Innovations';
export const SC_ADDRESS = process.env.NEXT_PUBLIC_SC_ADDRESS!;
export const TOKEN_ADDRESS = TOKEN.address;
const NETWORK_ENV =
  process.env.NEXT_PUBLIC_BLOCKCHAIN_ENVIRONMENT ?? 'mainnet';
const IS_MAINNET = NETWORK_ENV === 'mainnet';

export const CHAIN_ID = IS_MAINNET ? mainnet.id : sepolia.id;
export const MAX_LOCK_PERIOD = 31104000;
export const MIN_LOCK_PERIOD_IN_DAYS = 30;
export const MIN_LOCK_PERIOD = MIN_LOCK_PERIOD_IN_DAYS * 86400;
export const MAX_LOCK_PERIOD_IN_DAYS = MAX_LOCK_PERIOD / 86400;
export const PERIOD = 'day';
export const PERIODS = 'days';
export const BASE_MULTIPLIER = 2.08;
export const MAX_MULTIPLIER = 36;
export const MAX_ACTIVE_STAKE_LIMIT = 200_000_000;
