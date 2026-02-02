import React from 'react';
import { IIcon } from '@/types';
import { twMerge } from 'tailwind-merge';

export const IconCheck: React.FC<IIcon> = ({ className, ...props }) => {
  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={twMerge('h-6 w-6 fill-current', className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
      />
    </svg>
  );
};
