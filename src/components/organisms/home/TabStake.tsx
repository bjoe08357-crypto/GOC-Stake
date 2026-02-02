/* eslint-disable no-nested-ternary */

'use client';

import { IMAGE_PATH } from '@/utils/constant';
import Image from 'next/image';
import React, { useEffect, useState, useTransition } from 'react';
import Slider from 'rc-slider';
import { IconEdit, IconInfo } from '@/icons';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import {
  calculateMultiplier,
  isReachedMaxActiveStakeLimit,
} from '@/lib/utils/number';
import { useFeeData, useWriteContract } from 'wagmi';
import {
  CHAIN_ID,
  MAX_LOCK_PERIOD_IN_DAYS,
  MIN_LOCK_PERIOD_IN_DAYS,
  PERIOD,
  PERIODS,
  SC_ADDRESS,
  Stake,
  TOKEN,
  TOKEN_ADDRESS,
} from '@/lib/const';
import StakingArtifact from '@/abi/Staking.json';
import { toFixed, tokenToWei, weiToToken } from '@/utils/helpers';
import { erc20Abi } from 'viem';
import { config } from '@/wagmi';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { useCurrentUser } from '@/context/UserContext';
import { useGeneral } from '@/context/GeneralContext';
import { Tooltip } from '@/components/atoms';
import { ConnectButton, Loading } from '@/components/molecules';
import { ModalSteps, ModalStepStatus } from './ModalSteps';
import ModalErrorLimit from './ModalErrorLimit';

const TabStake: React.FC<{
  setOpenModalBuyToken: (data: boolean) => void;
}> = ({ setOpenModalBuyToken }) => {
  // * State
  const [token, setToken] = useState<string>('');
  const [period, setPeriod] = useState<number>(130);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [stakeStep, setStakeStep] = useState<string>('');
  const [openModalErrorLimit, setOpenModalErrorLimit] =
    useState<boolean>(false);
  const [openModalStep, setOpenModalStep] = useState<boolean>(false);
  const [selectedPriority, setSelectedPriority] = useState<
    'Standard' | 'Fast' | 'Turbo'
  >('Standard');
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState<ModalStepStatus>({
    index: 0,
    status: 'loading',
  });

  useEffect(() => {
    switch (stakeStep) {
      case 'APPROVAL_REQ':
        setCurrentStep({ index: 0, status: 'loading' });
        break;
      case 'APPROVAL_REJECT':
        setCurrentStep({ index: 0, status: 'error' });
        break;
      case 'STAKE_REQ':
        setCurrentStep({ index: 1, status: 'loading' });
        break;
      case 'STAKE_REJECT':
        setCurrentStep({ index: 1, status: 'error' });
        break;
      case 'STAKE_SUCCESS':
        setCurrentStep({ index: 2, status: 'loading' });
        break;
      case 'FINISH':
        setCurrentStep({ index: 3, status: 'success' });
        setTimeout(() => {
          setOpenModalStep(false);
          setTimeout(() => {
            setStakeStep('');
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
  }, [stakeStep]);

  // * Functions
  const date = new Date();
  date.setDate(date.getDate() + period);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  const formattedEndDate = new Date(date).toLocaleDateString(
    undefined,
    options
  );

  const { data: feeData } = useFeeData({ chainId: CHAIN_ID });
  const standardFee = feeData?.maxPriorityFeePerGas
    ? BigInt(feeData.maxPriorityFeePerGas.toString())
    : // @ts-ignore
      0n;
  // @ts-ignore
  const fastFee = standardFee ? (standardFee * 110n) / 100n : 0n;
  // @ts-ignore
  const turboFee = standardFee ? (standardFee * 120n) / 100n : 0n;

  const feeOverrides = {
    Standard: standardFee,
    Fast: fastFee,
    Turbo: turboFee,
  };
  const selectedFee = feeOverrides[selectedPriority];
  const {
    userAddress,
    stakes: stakedByAddress,
    userToken: tokenStake,
    refetchStakes,
    refetchUserToken,
    totalActiveUserStake,
    refetchTotalActiveUserStake,
  } = useCurrentUser();
  const { refetchTotalStaked, refetchUniqueStakersCount } = useGeneral();
  const stakes = Array.isArray(stakedByAddress)
    ? (stakedByAddress as Stake[])
    : [];

  const totalStaked = stakes
    .filter((stake) => !stake.withdrawn)
    // @ts-ignore
    .reduce((sum, stake) => sum + stake.amount, 0n);

  const { writeContractAsync } = useWriteContract({ config });

  const handleStake = async () => {
    setErrorMessage('');
    const isLimit = isReachedMaxActiveStakeLimit(token, totalActiveUserStake);
    if (isLimit) {
      setOpenModalErrorLimit(true);
      return;
    }

    setStakeStep('');
    if (Number(token) > Number(tokenStake?.formatted ?? '0')) {
      setOpenModalBuyToken(true);
      return;
    }

    setOpenModalStep(true);
    startTransition(async () => {
      const amountToStake = tokenToWei(token);
      const currentAllowance = await readContract(config, {
        abi: erc20Abi,
        address: TOKEN_ADDRESS as `0x${string}`,
        functionName: 'allowance',
        args: [userAddress as `0x${string}`, SC_ADDRESS as `0x${string}`],
        chainId: CHAIN_ID,
      });
      if (currentAllowance < amountToStake) {
        let approveTx;
        try {
          setStakeStep('APPROVAL_REQ');
          approveTx = await writeContractAsync({
            abi: erc20Abi,
            address: TOKEN_ADDRESS as `0x${string}`,
            functionName: 'approve',
            args: [SC_ADDRESS as `0x${string}`, amountToStake],
            maxPriorityFeePerGas: selectedFee,
          });
        } catch (error: any) {
          if (error?.shortMessage) {
            setErrorMessage(error.shortMessage);
          }
          setStakeStep('APPROVAL_REJECT');
          return;
        }
        await waitForTransactionReceipt(config, {
          hash: approveTx,
        });
      }
      try {
        setStakeStep('STAKE_REQ');
        const stakeTx = await writeContractAsync({
          abi: StakingArtifact.abi,
          address: SC_ADDRESS as `0x${string}`,
          functionName: 'stake',
          args: [amountToStake, period * 86400],
          maxPriorityFeePerGas: selectedFee,
        });
        await waitForTransactionReceipt(config, {
          hash: stakeTx!,
        });
        setStakeStep('STAKE_SUCCESS');
      } catch (error: any) {
        if (error?.shortMessage) {
          setErrorMessage(error.shortMessage);
        }
        setStakeStep('STAKE_REJECT');
        return;
      }
      await refetchStakes();
      await refetchUserToken();
      await refetchUniqueStakersCount();
      await refetchTotalStaked();
      await refetchTotalActiveUserStake();
      setStakeStep('FINISH');
    });
  };

  const handleHalfClick = () => {
    if (tokenStake?.formatted) {
      const available = parseFloat(tokenStake.formatted);
      setToken((available / 2).toFixed(2));
    }
  };

  const handleMaxClick = () => {
    if (tokenStake?.formatted) {
      setToken(tokenStake.formatted);
    }
  };

  const handleMinPlusToken = (action: 'min' | 'plus') => {
    if (action === 'min') {
      setToken(Number(token) > 1 ? toFixed(Number(token) - 1).toString() : '');
    } else {
      setToken(toFixed((Number(token) > 0 ? Number(token) : 0) + 1).toString());
    }
  };

  const handleMinPlusPeriod = (action: 'min' | 'plus') => {
    if (action === 'min') {
      setPeriod((Number(period) > 30 ? Number(period) : 31) - 1);
    } else {
      setPeriod((Number(period) < 360 ? Number(period) : 359) + 1);
    }
  };

  return (
    <>
      <ModalErrorLimit
        isOpen={openModalErrorLimit}
        onClose={() => setOpenModalErrorLimit(false)}
      />
      <ModalSteps
        title="Staking in Progress"
        desc="Processing your stake. This may take a moment."
        errorMessage={errorMessage}
        currentStep={currentStep}
        isOpen={openModalStep}
        stepList={['Approval', 'Stake', 'Finish']}
        onClose={() => {
          setOpenModalStep(false);
          setTimeout(() => {
            setStakeStep('');
            setErrorMessage('');
          }, 500);
        }}
      />
      <div className="flex justify-between">
        <p className="hidden text-lg font-semibold sm:block">Amount</p>
        <div className="flex w-full items-center justify-normal gap-2.5 sm:justify-end">
          <p className="text-content/50 mr-auto text-sm font-medium tracking-wider sm:mr-0">
            Available: <br className="sm:hidden" />
            {tokenStake
              ? Number(tokenStake.formatted).toLocaleString()
              : '0'}{' '}
            {TOKEN.symbol}
          </p>
          <button
            onClick={handleHalfClick}
            className="text-title/80 border-title/20 hover:text-title hover:border-title/50 h-6 w-12 cursor-pointer rounded-sm border text-xs font-medium tracking-wider"
          >
            HALF
          </button>
          <button
            onClick={handleMaxClick}
            className="text-title/80 border-title/20 hover:text-title hover:border-title/50 h-6 w-12 cursor-pointer rounded-sm border text-xs font-medium tracking-wider"
          >
            MAX
          </button>
        </div>
      </div>
      <div className="from-title/10 mt-4 flex flex-col items-center rounded-lg bg-linear-to-br to-[#6B7280]/10 px-4 py-4 sm:flex-row">
        <div className="mr-auto flex items-center sm:mr-0">
          <Image
            src={IMAGE_PATH.drxToken}
            width={30}
            height={30}
            className="aspect-square h-8 object-cover"
            alt=""
          />
          <div className="ml-4 min-w-32">
            <p className="text-title text-lg font-semibold text-nowrap">
              {`${TOKEN.shortSymbol} Token`}
            </p>
            <p className="text-content/60 text-xs font-medium tracking-wider">
              Staked: {parseFloat(Number(weiToToken(totalStaked)).toFixed(2))}
            </p>
          </div>
        </div>
        <div className="border-content/5 relative mt-4 ml-0 flex min-h-12 w-full items-center border-b-2 sm:mt-0 sm:ml-4">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/[^\d.]/g, ''))}
            placeholder="10000"
            className="placeholder:text-content/50 w-full rounded-md text-left text-[22px] font-semibold focus:outline-none sm:text-[28px]"
          />
          <div className="mr-1 flex">
            <button
              onClick={() => handleMinPlusToken('min')}
              className="hover:bg-title/20 text-content/80 w-9 cursor-pointer rounded-sm text-3xl font-semibold"
            >
              -
            </button>
            <div className="border-title/10 mx-1 my-auto h-8 border-r-2" />
            <button
              onClick={() => handleMinPlusToken('plus')}
              className="hover:bg-title/20 text-content/80 w-9 cursor-pointer rounded-sm text-3xl font-semibold"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="from-title/10 mt-4 rounded-lg bg-linear-to-br to-[#6B7280]/10 px-4 py-5">
        <div className="flex w-full flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="text-content/80 min-w-36 font-semibold text-nowrap">
            Lockup Period
          </p>
          <div className="border-content/5 relative mt-4 ml-0 flex min-h-12 w-full items-center border-b-2 sm:mt-0 sm:ml-4">
            <input
              value={period}
              className="text-content/90 w-full max-w-full pr-2 text-xl font-semibold focus:outline-none sm:text-2xl"
              onChange={(e) => {
                const value = Number(e.target.value.replace(/\D/, '') ?? '0');
                setPeriod(value);
              }}
            />
            <p className="text-content/90 ml-auto text-xl font-semibold sm:text-2xl">
              {period > 1 ? PERIODS : PERIOD}
            </p>
            <div className="mr-1 ml-2 flex">
              <button
                onClick={() => handleMinPlusPeriod('min')}
                className="hover:bg-title/20 text-content/80 w-9 cursor-pointer rounded-sm text-3xl font-semibold"
              >
                -
              </button>
              <div className="border-title/10 mx-1 my-auto h-8 border-r-2" />
              <button
                onClick={() => handleMinPlusPeriod('plus')}
                className="hover:bg-title/20 text-content/80 w-9 cursor-pointer rounded-sm text-3xl font-semibold"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <Slider
          className="mt-5 mb-3 h-10"
          min={MIN_LOCK_PERIOD_IN_DAYS}
          max={MAX_LOCK_PERIOD_IN_DAYS}
          value={period}
          onChange={(e) => {
            setPeriod(Number(e ?? '0'));
          }}
        />
      </div>
      <div className="from-title/10 mt-4 rounded-lg bg-linear-to-br to-[#6B7280]/10 px-4 py-5">
        <div className="flex justify-between">
          <p className="text-content/70 text-xs font-semibold sm:text-sm">
            Unlock in
          </p>
          <p className="text-content/70 text-xs font-semibold sm:text-sm">
            {period} {period > 1 ? PERIODS : PERIOD}
          </p>
        </div>
        <div className="mt-2 flex justify-between">
          <p className="text-content/70 text-xs font-semibold sm:text-sm">
            Stake end date
          </p>
          <p className="text-content/70 text-xs font-semibold sm:text-sm">
            {formattedEndDate}
          </p>
        </div>
        <div className="mt-2 flex justify-between">
          <p className="text-content/70 text-xs font-semibold sm:text-sm">
            Total staked
          </p>
          <p className="text-content/70 text-xs font-semibold sm:text-sm">
            {parseFloat(Number(weiToToken(totalStaked)).toFixed(2))}
          </p>
        </div>
        <div className="mt-2 flex justify-between">
          <div className="flex items-center">
            <p className="text-content/70 text-xs font-semibold sm:text-sm">
              Staking rewards
            </p>
            <Tooltip
              // className="flex"
              contentClassName="w-60 text-xs sm:text-[13px]"
              message="The reward % shown reflects the lock-up period you’ve selected."
            >
              <IconInfo className="text-content/70 ml-1 size-3 cursor-pointer sm:size-3.5" />
            </Tooltip>
          </div>
          <p className="text-title/90 text-xs font-semibold sm:text-sm">
            {parseFloat(calculateMultiplier(period * 86400).toFixed(2))} %
          </p>
        </div>
        <div className="mt-2 flex justify-between">
          <p className="text-content/70 text-xs font-semibold sm:text-sm">
            {TOKEN.symbol} Earned
          </p>
          <p className="text-title/90 text-xs font-semibold sm:text-sm">
            {parseFloat(
              (
                (Number(token) * calculateMultiplier(period * 86400)) /
                100
              ).toFixed(2)
            )}{' '}
            {TOKEN.symbol}
          </p>
        </div>
        <div className="mt-2 flex gap-1">
          <p className="text-content/70 text-xs font-semibold sm:text-sm">
            Priority fee
          </p>
          <Popover className="popover">
            <PopoverButton className="text-content/70 flex cursor-pointer items-center gap-1.5 border-b-[1.5px] focus:outline-none">
              <p className="items-center text-xs font-extrabold sm:text-sm">
                ({selectedPriority})
              </p>
              <IconEdit className="size-3.5" />
            </PopoverButton>
            <PopoverPanel
              transition
              anchor="bottom"
              className="bg-base-bg/90 rounded-lg py-2 text-sm/6 backdrop-blur-2xl transition duration-100 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
            >
              <div className="w-28">
                {['Standard', 'Fast', 'Turbo'].map((prt, idx) => (
                  <PopoverButton
                    key={idx}
                    onClick={() =>
                      setSelectedPriority(prt as 'Standard' | 'Fast' | 'Turbo')
                    }
                    className="hover:bg-title/10 w-full cursor-pointer rounded-md px-4 py-1 font-semibold"
                  >
                    {prt}
                  </PopoverButton>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
        </div>
      </div>
      {userAddress ? (
        <Tooltip
          conClassName="mt-4"
          message={
            Number(token ?? '0') === 0
              ? 'Amount is 0!'
              : period < MIN_LOCK_PERIOD_IN_DAYS ||
                  period > MAX_LOCK_PERIOD_IN_DAYS
                ? 'Lockup period must be between 30 and 360 days.'
                : ''
          }
        >
          <button
            onClick={handleStake}
            disabled={
              isPending ||
              !(Number(token) > 0) ||
              period < MIN_LOCK_PERIOD_IN_DAYS ||
              period > MAX_LOCK_PERIOD_IN_DAYS
            }
            className="bg-title text-base-bg h-12 w-full cursor-pointer rounded-lg text-lg font-bold hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isPending ? <Loading size={25} /> : 'Stake'}
          </button>
        </Tooltip>
      ) : (
        <ConnectButton className="bg-title text-base-bg mt-4 h-12 w-full cursor-pointer rounded-lg text-lg font-bold hover:opacity-80" />
      )}
    </>
  );
};

export default TabStake;
