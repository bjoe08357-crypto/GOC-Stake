import React, { useEffect, useState } from 'react';
import { formatRemaining } from '@/lib/utils/date';

type CountdownProps = {
  endDate: Date;
};

export const Countdown = ({ endDate }: CountdownProps) => {
  const [remaining, setRemaining] = useState(formatRemaining(endDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(formatRemaining(endDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return <span>{remaining}</span>;
};
