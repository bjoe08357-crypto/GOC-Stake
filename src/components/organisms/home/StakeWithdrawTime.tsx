import React, { useState } from 'react';
import { formatDate } from '@/lib/utils/date';
import { Loading } from '@/components/molecules';
import { Countdown } from '../Countdown';

type StakeWithdrawTimeProps = {
  endDate: Date;
  index: number;
  isPending: boolean;
  isWithdrawn: boolean;
  endTimestamp: number;
  handleWithdraw: (index: number) => Promise<void>;
};

const StakeWithdrawTime = ({
  index,
  endDate,
  isPending,
  isWithdrawn,
  endTimestamp,
  handleWithdraw,
}: StakeWithdrawTimeProps) => {
  const [isWithdrawable, setIsWithdrawable] = useState(false);

  const intervalIsWithdrawn = setInterval(() => {
    setIsWithdrawable(Date.now() >= endDate.getTime() && !isWithdrawn);
  }, 1000);

  if (isWithdrawn && Date.now() >= endDate.getTime() && isWithdrawable) {
    clearInterval(intervalIsWithdrawn);
    setIsWithdrawable(false);
  }

  return (
    <div className="text-right *:max-w-20 sm:*:max-w-none">
      <p className="text-content/60 text-[10px] font-medium tracking-wider sm:text-xs">
        {!isWithdrawable ? 'Ended at' : 'Unlock at'}
      </p>
      <p className="text-content/80 mt-2 text-xs font-semibold tracking-wider sm:text-base">
        {formatDate(endTimestamp)}
      </p>
      {isWithdrawable ? (
        <button
          disabled={isPending}
          onClick={() => handleWithdraw(index)}
          className="bg-title text-base-bg mt-2 h-5 w-20 cursor-pointer rounded text-xs font-bold hover:opacity-80 disabled:cursor-default"
        >
          {isPending ? <Loading size={16} /> : 'Withdraw'}
        </button>
      ) : (
        <p className="text-content/60 text-[10px] font-medium tracking-wider sm:text-xs">
          <Countdown endDate={endDate} />
        </p>
      )}
    </div>
  );
};

export default StakeWithdrawTime;
