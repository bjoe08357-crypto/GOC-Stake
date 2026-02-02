'use client';

import { projectId, wagmiAdapter } from '@/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import React, { type ReactNode } from 'react';
import { type Config, cookieToInitialState, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from '@reown/appkit/networks';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/const';

// Set up queryClient
const queryClient = new QueryClient();

const NETWORK_ENV =
  process.env.NEXT_PUBLIC_BLOCKCHAIN_ENVIRONMENT ?? 'mainnet';
const IS_MAINNET = NETWORK_ENV === 'mainnet';

// Set up metadata
const metadata = {
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: process.env.NEXT_PUBLIC_DOMAIN!,
  icons: [`${process.env.NEXT_PUBLIC_DOMAIN!}/assets/goc-token.svg`],
};

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: IS_MAINNET ? [mainnet] : [sepolia],
  defaultNetwork: IS_MAINNET ? mainnet : sepolia,
  metadata,
  allWallets: 'SHOW',
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393', // Phantom
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
  ],
  features: {
    analytics: true,
    email: false,
    socials: false,
    swaps: false,
    send: false,
    onramp: false,
    allWallets: true,
    history: false,
  },
  themeVariables: {
    '--w3m-accent': '#C0C0C0',
    '--w3m-color-mix': '#232222',
    '--w3m-qr-color': '#C0C0C0',
  },
  themeMode: 'dark',
});

function Web3ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default Web3ContextProvider;
