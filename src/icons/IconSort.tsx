import React from 'react';
import { IIcon } from '@/types';
import { twMerge } from 'tailwind-merge';

export const IconSort: React.FC<IIcon> = ({ className, ...props }) => {
  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      className={twMerge('h-6 w-6 fill-current', className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM192 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l128 0c17.7 0 32 14.3 32 32z"
      />
    </svg>
  );
};
