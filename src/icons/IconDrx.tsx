import { IIcon } from '@/types';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { TOKEN } from '@/lib/const';

export const IconDrx: React.FC<IIcon> = ({ className, ...props }) => {
  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 38 10"
      className={twMerge('size-6 fill-current', className)}
      {...props}
    >
      <text
        x="0"
        y="8"
        fontFamily="Arial, sans-serif"
        fontSize="8"
        fontWeight="700"
        fill="currentColor"
      >
        {TOKEN.symbol}
      </text>
    </svg>
  );
};
