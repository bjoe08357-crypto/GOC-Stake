import React, { useState } from 'react';
import { getProgressPercentage } from '@/lib/utils/number';

type ProgressProps = {
  start: number;
  lock: number;
};

export const Progress = ({ start, lock }: ProgressProps) => {
  const [newProgress, setNewProgress] = useState(0);

  const progress = getProgressPercentage(start, lock);
  setInterval(() => {
    setNewProgress(progress);
  }, 1000);

  return (
    <div className="bg-content/20 relative mt-0.5 w-24 overflow-hidden rounded-full">
      <div
        style={{ width: `${newProgress}%` }}
        className="bg-title h-2 rounded-full"
      />
    </div>
  );
};
