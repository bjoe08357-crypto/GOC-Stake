import { cookieStorage, createStorage } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, sepolia } from '@reown/appkit/networks';
import { http } from 'wagmi';

export const projectId = '5b151783bdfb85d5f27f3ef7ae0a02f0';

export const networks =
  process.env.NEXT_PUBLIC_BLOCKCHAIN_ENVIRONMENT === 'mainnet'
    ? [mainnet]
    : [sepolia];

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
