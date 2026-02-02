import { mainnet, sepolia } from 'wagmi/chains';
import { TOKEN } from './token';

export const SITE_NAME = 'GOC Staking';
export const SITE_DESCRIPTION =
  'The GOC Stake Platform is a dedicated testing and demonstration environment built to showcase how token staking works on the Ethereum blockchain. It is designed for trial use, feature validation, and live demos of staking, rewards distribution, and claim mechanisms before full production deployment. By using Ethereum\'s secure and transparent infrastructure, the platform allows users and partners to safely experience the staking flow, wallet interaction, and reward logic in a controlled setup. The GOC Stake Platform serves as a practical testbed for refining staking features and preparing future production-ready releases.';
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
