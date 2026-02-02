import React from 'react';
import { twMerge } from 'tailwind-merge';
import { IconSpinner } from '@/icons/IconSpinner';

export const Loading: React.FC<{ className?: string; size?: number }> = ({
  className,
  size = 24,
}) => {
  return (
    <div
      className={twMerge(
        'text-base-content/80 flex h-full w-full items-center justify-center',
        className
      )}
    >
      <IconSpinner
        className="animate-spin"
        style={{ height: size, width: size }}
      />
    </div>
  );
};
