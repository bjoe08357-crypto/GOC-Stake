'use client';

import { IMAGE_PATH } from '@/utils/constant';
import Image from 'next/image';
import React from 'react';
import { ConnectButton } from '../molecules';
import { SITE_NAME } from '@/lib/const';

export const Header = () => {
  return (
    <div className="border-title/10 bg-base-bg fixed top-0 left-0 z-10 h-[90px] w-full border-b">
      <div className="mx-auto flex h-full w-full max-w-[1536px] items-center px-4 sm:px-16">
        <Image
          src={IMAGE_PATH.drxToken}
          width={50}
          height={50}
          className="h-[50px] object-contain"
          alt=""
        />
        <p className="text-title mr-auto ml-2 text-lg font-bold sm:text-xl">
          {SITE_NAME}
        </p>
        <ConnectButton />
      </div>
    </div>
  );
};
