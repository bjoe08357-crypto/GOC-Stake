'use client';

import { createContext, useContext } from 'react';
import { CHAIN_ID, SC_ADDRESS } from '@/lib/const';
import { QueryObserverResult, RefetchOptions } from '@tanstack/query-core';
import { ReadContractErrorType } from 'viem';
import { useReadContract } from 'wagmi';
import StakingArtifact from '@/abi/Staking.json';

interface GeneralContextValue {
  uniqueStakersCount: unknown;
  refetchUniqueStakersCount: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<unknown, ReadContractErrorType>>;
  totalStaked: unknown;
  refetchTotalStaked: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<unknown, ReadContractErrorType>>;
  isLoading: boolean;
}

const GeneralContext = createContext<GeneralContextValue | undefined>(
  undefined
);

export function GeneralProvider({ children }: { children: React.ReactNode }) {
  const {
    data: uniqueStakersCount,
    refetch: refetchUniqueStakersCount,
    isLoading: isLoadingUniqueStakersCount,
  } = useReadContract({
    abi: StakingArtifact.abi,
    address: SC_ADDRESS as `0x${string}`,
    chainId: CHAIN_ID,
    functionName: 'uniqueStakersCount',
  });
  const {
    data: totalStaked,
    refetch: refetchTotalStaked,
    isLoading: isLoadingTotalStaked,
  } = useReadContract({
    abi: StakingArtifact.abi,
    address: SC_ADDRESS as `0x${string}`,
    chainId: CHAIN_ID,
    functionName: 'totalStaked',
  });
  const isLoading = isLoadingUniqueStakersCount || isLoadingTotalStaked;

  const value: GeneralContextValue = {
    uniqueStakersCount,
    refetchUniqueStakersCount,
    totalStaked,
    refetchTotalStaked,
    isLoading,
  };

  return (
    <GeneralContext.Provider value={value}>{children}</GeneralContext.Provider>
  );
}

export function useGeneral() {
  const context = useContext(GeneralContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }
  return context;
}
