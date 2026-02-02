'use client';

import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

type ITooltip = {
  children: React.ReactNode;
  message: string;
  className?: string;
  conClassName?: string;
  contentClassName?: string;
};

export const Tooltip: React.FC<ITooltip> = ({
  children,
  message,
  className,
  conClassName,
  contentClassName,
}) => {
  const [show, setShow] = useState(false);
  if (message === '') {
    return (
      <div className={twMerge('group relative', conClassName)}>
        <span className="flex justify-center">{children}</span>
      </div>
    );
  }
  return (
    <div className={twMerge('group relative', conClassName)}>
      <span
        className="flex justify-center"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </span>
      <div
        className={twMerge(
          `absolute bottom-full left-1/2 flex -translate-x-1/2 flex-col items-center group-hover:flex ${!show ? 'hidden' : ''}`,
          className
        )}
      >
        <span
          className={twMerge(
            'bg-base-bg text-content/80 border-title/40 relative z-10 rounded-md border p-2 text-center text-sm font-medium tracking-wider',
            contentClassName
          )}
        >
          {message}
        </span>
        <div className="bg-base-bg border-title/40 -mt-2 h-3 w-3 rotate-45 border" />
        <div className="bg-base-bg z-10 -mt-[11px] h-2.5 w-2.5 rotate-45" />
      </div>
    </div>
  );
};
