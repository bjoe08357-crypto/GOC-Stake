import { IIcon } from '@/types';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { TOKEN } from '@/lib/const';

export const IconDrxToken: React.FC<IIcon> = ({ className, ...props }) => {
  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 95 42"
      className={twMerge('size-6 fill-current', className)}
      {...props}
    >
      <text
        x="47.5"
        y="26"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="currentColor"
      >
        {TOKEN.displayName}
      </text>
    </svg>
  );
};
