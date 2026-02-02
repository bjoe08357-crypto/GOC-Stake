import { cookieStorage, createStorage } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, sepolia } from '@reown/appkit/networks';
import { http } from 'wagmi';

export const projectId =
  process.env.NEXT_PUBLIC_APPKIT_PROJECT_ID ??
  process.env.NEXT_PUBLIC_PROJECT_ID ??
  '5b151783bdfb85d5f27f3ef7ae0a02f0';

const NETWORK_ENV =
  process.env.NEXT_PUBLIC_BLOCKCHAIN_ENVIRONMENT ?? 'mainnet';
const IS_MAINNET = NETWORK_ENV === 'mainnet';

export const networks = IS_MAINNET ? [mainnet] : [sepolia];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
  transports: {
    [mainnet.id]: http('/api/proxy'),
    [sepolia.id]: http('/api/proxy'),
  },
});

export const config = wagmiAdapter.wagmiConfig;
