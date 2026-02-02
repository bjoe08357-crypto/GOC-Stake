'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { twMerge } from 'tailwind-merge';
import { useWriteContract } from 'wagmi';
import { SC_ADDRESS, Stake, TOKEN } from '@/lib/const';
import StakingArtifact from '@/abi/Staking.json';
import { IconDrx, IconGive, IconSort } from '@/icons';
import { weiToToken } from '@/utils/helpers';
import { config } from '@/wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { useCurrentUser } from '@/context/UserContext';
import { useGeneral } from '@/context/GeneralContext';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { calculateMultiplier, calculateRewardLocal } from '@/lib/utils/number';
import Decimal from 'decimal.js';
import { ConnectButton } from '@/components/molecules';
import { Progress } from '../Progress';
import StakeWithdrawTime from './StakeWithdrawTime';
import { ModalSteps, ModalStepStatus } from './ModalSteps';

type FilterType = 'All' | 'Staked' | 'Withdrawn';
type SortKey = 'amount' | 'withdrawn' | 'ended';
type SortOrder = 'asc' | 'desc';

const TabWithdraw: React.FC<{ setTab: (tab: number) => void }> = ({
  setTab,
}) => {
  // * State
  const [filter, setFilter] = useState<FilterType>('All');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [withdrawStep, setWithdrawStep] = useState<string>('');
  const [openModalStep, setOpenModalStep] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<ModalStepStatus>({
    index: 0,
    status: 'loading',
  });
  const [sort, setSort] = useState<{ by: SortKey; order: SortOrder }>({
    by: 'ended',
    order: 'desc',
  });
  const [sortedStakes, setSortedStakes] = useState<
    (Stake & { index: number })[]
  >([]);
  const [filteredStakes, setFilteredStakes] = useState<
    (Stake & { index: number })[]
  >([]);

  useEffect(() => {
    switch (withdrawStep) {
      case 'WITHDRAW_REQ':
        setCurrentStep({ index: 0, status: 'loading' });
        break;
      case 'WITHDRAW_ERROR':
        setCurrentStep({ index: 0, status: 'error' });
        break;
      case 'WITHDRAW_SUCCESS':
        setCurrentStep({ index: 1, status: 'loading' });
        break;
      case 'FINISH':
        setCurrentStep({ index: 2, status: 'success' });
        setTimeout(() => {
          setOpenModalStep(false);
          setTimeout(() => {
            setWithdrawStep('');
            setErrorMessage('');
          }, 500);
        }, 2000);
        break;
      case 'ERROR':
        setCurrentStep({ index: currentStep.index, status: 'error' });
        break;
      default:
        setCurrentStep({ index: 0, status: 'loading' });
    }
  }, [withdrawStep]);

  const [isPending, startTransition] = useTransition();
  const {
    userAddress,
    stakes: stakedByAddress,
    refetchStakes,
    refetchUserToken,
    refetchTotalActiveUserStake,
  } = useCurrentUser();
  const { refetchTotalStaked, refetchUniqueStakersCount } = useGeneral();

  const stakes: (Stake & { index: number })[] = Array.isArray(stakedByAddress)
    ? (stakedByAddress as Stake[]).map((stake, i) => ({ ...stake, index: i }))
    : [];

  const totalActive = stakes
    .filter((s) => !s.withdrawn)
    // @ts-ignore
    .reduce((sum, s) => sum + s.amount, 0n);
  const totalWithdrawn = stakes
    .filter((s) => s.withdrawn)
    // @ts-ignore
    .reduce((sum, s) => sum + s.amount, 0n);
  const totalRewards = stakes
    .filter((s) => s.withdrawn)
    .reduce((sum, s) => sum.plus(calculateRewardLocal(s)), new Decimal(0));
  const activeCount = stakes.filter((s) => !s.withdrawn).length;
  const totalCount = stakes.length;

  const handleSort = () => {
    const newItems = stakes.sort((a, b) => {
      let valA: number | bigint | boolean;
      let valB: number | bigint | boolean;

      switch (sort.by) {
        case 'amount':
          valA = a.amount;
          valB = b.amount;
          break;
        case 'withdrawn':
          valA = a.withdrawn ? 1 : 0;
          valB = b.withdrawn ? 1 : 0;
          break;
        case 'ended':
          valA = a.startTimestamp + a.lockPeriod;
          valB = b.startTimestamp + b.lockPeriod;
          break;
        default:
          valA = a.withdrawn ? 1 : 0;
          valB = b.withdrawn ? 1 : 0;
          break;
      }

      if (valA < valB) return sort.order === 'asc' ? -1 : 1;
      if (valA > valB) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedStakes(newItems);
  };

  useEffect(() => {
    if (
      totalCount !== 0 &&
      stakes.length > 0 &&
      userAddress &&
      (!(sortedStakes.length > 0) ||
        stakes.filter((st) => !st.withdrawn).length !==
          sortedStakes.filter((st) => !st.withdrawn).length)
    ) {
      handleSort();
    }
    if (
      !userAddress &&
      totalCount === 0 &&
      sortedStakes.length > 0 &&
      !(stakes.length > 0)
    ) {
      setSortedStakes([]);
    }
  }, [stakes]);
  useEffect(() => {
    handleSort();
  }, [sort.by, sort.order]);
  useEffect(() => {
    if (filter === 'Staked') {
      setFilteredStakes(sortedStakes.filter((s) => !s.withdrawn));
    } else if (filter === 'Withdrawn') {
      setFilteredStakes(sortedStakes.filter((s) => s.withdrawn));
    } else {
      setFilteredStakes(sortedStakes);
    }
  }, [sortedStakes, filter]);

  const { writeContractAsync } = useWriteContract({ config });

  const handleWithdraw = async (index: number) => {
    setOpenModalStep(true);
    startTransition(async () => {
      try {
        setWithdrawStep('WITHDRAW_REQ');
        const unstakeTx = await writeContractAsync({
          abi: StakingArtifact.abi,
          address: SC_ADDRESS as `0x${string}`,
          functionName: 'unstake',
          args: [index],
        });
        await waitForTransactionReceipt(config, {
          hash: unstakeTx,
        });
        setWithdrawStep('WITHDRAW_SUCCESS');
      } catch (error: any) {
        if (error?.shortMessage) {
          setErrorMessage(error.shortMessage);
        }
        setWithdrawStep('WITHDRAW_ERROR');
        return;
      }
      await refetchStakes();
      await refetchUserToken();
      await refetchUniqueStakersCount();
      await refetchTotalStaked();
      await refetchTotalActiveUserStake();
      setWithdrawStep('FINISH');
    });
  };

  return (
    <>
      <ModalSteps
        title="Withdraw in Progress"
        desc="Processing your withdraw. This may take a moment."
        errorMessage={errorMessage}
        currentStep={currentStep}
        isOpen={openModalStep}
        stepList={['Withdraw', 'Finish']}
        onClose={() => {
          setOpenModalStep(false);
          setTimeout(() => {
            setWithdrawStep('');
            setErrorMessage('');
          }, 500);
        }}
      />
      <div className="border-title/20 mb-4 grid grid-cols-2 gap-x-2 rounded-lg border py-3 sm:grid-cols-4">
        <div className="flex min-h-24 flex-col">
          <div className="flex h-full flex-col justify-center">
            <p className="text-title mt-1 text-center text-3xl font-bold">
              {activeCount}
            </p>
            <p className="text-title mt-1 text-center text-sm font-semibold">
              active
            </p>
          </div>
          <p className="text-content/60 mt-auto text-center text-sm font-semibold">
            of {totalCount} stake
          </p>
        </div>
        <div className="flex min-h-24 flex-col">
          <div className="flex h-full flex-col justify-center">
            <p className="text-title text-center text-3xl font-bold">
              {parseFloat(Number(weiToToken(totalActive)).toFixed(2))}
            </p>
            <IconDrx className="text-title mt-2 h-3 w-auto object-cover" />
          </div>
          <p className="text-content/60 mt-auto text-center text-sm font-semibold">
            Active Staked
          </p>
        </div>
        <div className="flex min-h-24 flex-col">
          <div className="flex h-full flex-col justify-center">
            <p className="text-title text-center text-3xl font-bold">
              {parseFloat(Number(weiToToken(totalWithdrawn)).toFixed(2))}
            </p>
            <IconDrx className="text-title mt-2 h-3 w-auto object-cover" />
          </div>
          <p className="text-content/60 mt-auto text-center text-sm font-semibold">
            Withdrawn
          </p>
        </div>
        <div className="flex min-h-24 flex-col">
          <div className="flex h-full flex-col justify-center">
            <p className="text-title text-center text-3xl font-bold">
              {parseFloat(
                Number(weiToToken(totalRewards.toFixed(0))).toFixed(2)
              )}
            </p>
            <IconDrx className="text-title mt-2 h-3 w-auto object-cover" />
          </div>
          <p className="text-content/60 mt-auto text-center text-sm font-semibold">
            Rewards
          </p>
        </div>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row">
        <p
          className="text-content/80 text-lg font-semibold"
          onClick={() => handleWithdraw(1)}
        >
          Stake History
        </p>
        <div className="mt-2 ml-auto flex items-center gap-2.5 sm:mt-0">
          <button
            onClick={() => setFilter('All')}
            className={twMerge(
              'border-title/20 hover:border-title/50 h-6 rounded-sm border px-2 text-xs tracking-wider',
              filter === 'All'
                ? 'bg-title text-base-bg font-bold'
                : 'text-title/80 hover:text-title cursor-pointer font-medium'
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter('Staked')}
            className={twMerge(
              'border-title/20 hover:border-title/50 h-6 rounded-sm border px-2 text-xs font-medium tracking-wider',
              filter === 'Staked'
                ? 'bg-title text-base-bg font-bold'
                : 'text-title/80 hover:text-title cursor-pointer font-medium'
            )}
          >
            Staked
          </button>
          <button
            onClick={() => setFilter('Withdrawn')}
            className={twMerge(
              'border-title/20 hover:border-title/50 h-6 rounded-sm border px-2 text-xs font-medium tracking-wider',
              filter === 'Withdrawn'
                ? 'bg-title text-base-bg font-bold'
                : 'text-title/80 hover:text-title cursor-pointer font-medium'
            )}
          >
            Withdrawn
          </button>
          <Popover className="popover">
            <PopoverButton className="border-title/20 text-title/80 hover:text-title hover:border-title/50 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm border text-xs font-medium tracking-wider">
              <IconSort className="h-3.5 w-3.5" />
            </PopoverButton>
            <PopoverPanel
              transition
              anchor="bottom end"
              className="bg-base-bg/90 border-title/20 rounded-lg border text-sm/6 backdrop-blur-2xl transition duration-100 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
            >
              <div className="w-33">
                {[
                  'Amount ASC',
                  'Amount DESC',
                  'Withdrawn ASC',
                  'Withdrawn DESC',
                  'Ended ASC',
                  'Ended DESC',
                ].map((sr, idx) => {
                  const sortSplited = sr.split(' ');
                  return (
                    <PopoverButton
                      key={idx}
                      onClick={() =>
                        setSort({
                          by: sortSplited[0].toLowerCase() as any,
                          order: sortSplited[1].toLowerCase() as any,
                        })
                      }
                      className={twMerge(
                        'hover:bg-title/10 w-full cursor-pointer px-4 py-1.5 text-xs font-semibold',
                        sr.toLowerCase() ===
                          `${sort.by.toLowerCase()} ${sort.order.toLowerCase()}`
                          ? 'bg-title/10 text-title'
                          : 'text-content/80'
                      )}
                    >
                      {sr}
                    </PopoverButton>
                  );
                })}
              </div>
            </PopoverPanel>
          </Popover>
        </div>
      </div>
      <div className="my-auto flex max-h-[75vh] flex-col overflow-y-auto sm:max-h-[45vh]">
        {filteredStakes.length > 0 ? (
          filteredStakes.map((stake) => {
            const start = Number(stake.startTimestamp);
            const lock = Number(stake.lockPeriod);
            const endTimestamp = start + lock;
            const endDate = new Date(endTimestamp * 1000);
            const reward = calculateRewardLocal(stake);
            return (
              <div
                key={stake.index}
                className="from-title/10 flex rounded-lg bg-linear-to-br to-[#6B7280]/10 px-4 py-2.5 not-first:mt-4"
              >
                <div className="flex flex-col">
                  <p className="text-content/60 text-[10px] font-medium tracking-wider sm:text-xs">
                    Amount
                  </p>
                  <p
                    className={twMerge(
                      'mt-auto text-2xl font-bold sm:mt-1 sm:text-[28px]',
                      !stake.withdrawn ? 'text-title' : 'text-content/80'
                    )}
                  >
                    {parseFloat(Number(weiToToken(stake.amount)).toFixed(2))}
                  </p>
                  <IconDrx
                    className={twMerge(
                      'mt-auto mr-auto mb-1.5 h-2.5 w-auto max-w-max',
                      !stake.withdrawn ? 'text-title' : 'text-content/80'
                    )}
                  />
                </div>
                <div className="mx-auto flex flex-col">
                  <p className="text-content/60 text-[10px] font-medium tracking-wider sm:text-xs">
                    Staking rewards
                  </p>
                  <p className="text-content/80 mt-auto text-sm font-semibold tracking-wider sm:mt-2 sm:text-base">
                    {parseFloat(calculateMultiplier(lock).toFixed(2))}%
                  </p>
                  {!stake.withdrawn && <Progress start={start} lock={lock} />}
                  <div className="mt-3 flex items-center gap-1 sm:mt-1">
                    <IconGive
                      className={twMerge(
                        'size-3 sm:size-4',
                        !stake.withdrawn ? 'text-title' : 'text-content/80'
                      )}
                    />
                    <p
                      className={twMerge(
                        'text-sm font-semibold tracking-wide sm:text-base',
                        !stake.withdrawn ? 'text-title' : 'text-content/80'
                      )}
                    >
                      {parseFloat(
                        Number(weiToToken(reward.toString())).toFixed(2)
                      )}{' '}
                      <span className="text-xs">{TOKEN.symbol}</span>
                    </p>
                  </div>
                </div>
                <StakeWithdrawTime
                  endDate={endDate}
                  index={stake.index}
                  isPending={isPending}
                  endTimestamp={endTimestamp}
                  isWithdrawn={stake.withdrawn}
                  handleWithdraw={handleWithdraw}
                />
              </div>
            );
          })
        ) : (
          <>
            {userAddress ? (
              <div className="my-auto flex min-h-[38.5vh] flex-col items-center justify-center">
                <p className="text-content/60 text-center text-sm font-semibold">
                  Your staking history is currently empty. Stake your{' '}
                  {TOKEN.shortSymbol} tokens to see your activity listed here.
                </p>
                <button
                  className="bg-title text-base-bg mt-6 h-8 cursor-pointer rounded-sm px-4 text-sm font-bold tracking-wider hover:opacity-80"
                  onClick={() => setTab(0)}
                >
                  Stake {TOKEN.shortSymbol}
                </button>
              </div>
            ) : (
              <div className="my-auto flex min-h-[38.5vh] flex-col items-center justify-center">
                <p className="text-content/60 text-center text-sm font-semibold">
                  Connect your wallet to view your staking history.
                </p>
                <ConnectButton className="bg-title text-base-bg mt-6 h-8 w-auto cursor-pointer rounded-sm px-4 text-sm font-bold tracking-wider hover:opacity-80" />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default TabWithdraw;
