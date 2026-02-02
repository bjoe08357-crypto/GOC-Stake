'use client';

import { getShortenAddress } from '@/utils/helpers';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type CustomButtonProps = {
  open: Function;
  text?: string;
  address?: string;
  isConnected: boolean;
};
type IConnectButton = {
  className?: string;
  customButton?: (props: CustomButtonProps) => React.ReactNode;
};

export const ConnectButton: React.FC<IConnectButton> = ({
  className,
  customButton,
}) => {
  // * Hook
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  if (customButton) {
    return customButton({
      open,
      text:
        isConnected && address ? getShortenAddress(address) : 'Connect Wallet',
      address,
      isConnected,
    });
  }

  return (
    <button
      onClick={() => open()}
      type="button"
      className={twMerge(
        'bg-title text-base-bg h-9 w-33 cursor-pointer rounded-md text-sm font-black hover:opacity-60',
        className
      )}
    >
      {isConnected && address ? getShortenAddress(address) : 'Connect Wallet'}
    </button>
  );
};
