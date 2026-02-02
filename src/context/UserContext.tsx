'use client';

import { createContext, useContext } from 'react';
import { CHAIN_ID, SC_ADDRESS, Stake, TOKEN_ADDRESS } from '@/lib/const';
import { QueryObserverResult, RefetchOptions } from '@tanstack/query-core';
import { GetBalanceErrorType, ReadContractErrorType } from 'viem';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import StakingArtifact from '@/abi/Staking.json';

interface UserContextValue {
  userAddress: `0x${string}` | undefined;
  loading: boolean;
  stakes: Stake[];
  refetchStakes: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<unknown, ReadContractErrorType>>;
  userToken:
    | { decimals: number; formatted: string; symbol: string; value: bigint }
    | undefined;
  refetchUserToken: (
    options?: RefetchOptions | undefined
  ) => Promise<
    QueryObserverResult<
      { decimals: number; formatted: string; symbol: string; value: bigint },
      GetBalanceErrorType
    >
  >;
  totalActiveUserStake: bigint;
  refetchTotalActiveUserStake: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<unknown, ReadContractErrorType>>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { address: userAddress, status } = useAccount();

  const {
    data: userToken,
    refetch: refetchUserToken,
    isLoading: isLoadingUserToken,
  } = useBalance({
    address: userAddress as `0x${string}`,
    token: TOKEN_ADDRESS as `0x${string}`,
    chainId: CHAIN_ID,
  });
  const {
    data: stakedByAddress,
    refetch: refetchStakes,
    isLoading: isLoadingStakedByAddress,
  } = useReadContract({
    abi: StakingArtifact.abi,
    address: SC_ADDRESS as `0x${string}`,
    chainId: CHAIN_ID,
    functionName: 'getStakesByAddress',
    args: [userAddress],
  });

  const {
    data: totalActiveUserStake,
    refetch: refetchTotalActiveUserStake,
    isLoading: isLoadingTotalActiveUserStake,
  } = useReadContract({
    abi: StakingArtifact.abi,
    address: SC_ADDRESS as `0x${string}`,
    chainId: CHAIN_ID,
    functionName: 'getTotalActiveUserStake',
    args: [userAddress],
  });
  const loading =
    status === 'reconnecting' ||
    status === 'connecting' ||
    isLoadingUserToken ||
    isLoadingStakedByAddress ||
    isLoadingTotalActiveUserStake;

  const value: UserContextValue = {
    userAddress,
    loading,
    stakes: stakedByAddress as Stake[],
    refetchStakes,
    userToken,
    refetchUserToken,
    totalActiveUserStake: (totalActiveUserStake ?? 0n) as bigint,
    refetchTotalActiveUserStake,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useCurrentUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }
  return context;
}
