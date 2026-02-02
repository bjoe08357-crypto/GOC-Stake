'use client';

import { IMAGE_PATH } from '@/utils/constant';
import Image from 'next/image';
import React, { useState } from 'react';
import { IconEdit } from '@/icons';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { TOKEN } from '@/lib/const';

const TabWithdraw = () => {
  // * State
  const [token, setToken] = useState<string>('9');
  const [priority, setPriority] = useState<string>('Standard');

  return (
    <>
      <div className="flex justify-between">
        <p className="text-lg font-semibold">Amount</p>
        <div className="flex items-center gap-2.5">
          <button className="text-title/80 border-title/20 hover:text-title hover:border-title/50 h-6 w-12 cursor-pointer rounded-sm border text-xs font-medium tracking-wider">
            HALF
          </button>
          <button className="text-title/80 border-title/20 hover:text-title hover:border-title/50 h-6 w-12 cursor-pointer rounded-sm border text-xs font-medium tracking-wider">
            MAX
          </button>
        </div>
      </div>
      <div className="from-title/10 mt-4 flex items-center rounded-lg bg-linear-to-br to-[#6B7280]/10 px-4 py-5">
        <Image
          src={IMAGE_PATH.drxToken}
          width={30}
          height={30}
          className="aspect-square h-8 object-cover"
          alt=""
        />
        <div className="ml-4">
          <p className="text-title text-lg font-semibold text-nowrap">
            {`${TOKEN.shortSymbol} Token`}
          </p>
          <p className="text-content/60 text-xs font-medium tracking-wider text-nowrap">
            Available withdraw: 75
          </p>
        </div>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value.replace(/\D/, ''))}
          className="w-full text-right text-[28px] font-semibold focus:outline-none"
        />
      </div>
      <div className="from-title/10 mt-4 rounded-lg bg-linear-to-br to-[#6B7280]/10 px-4 py-5">
        <div className="flex gap-1">
          <p className="text-content/70 text-sm font-semibold">Priority fee</p>
          <Popover className="popover">
            <PopoverButton className="text-content/70 flex cursor-pointer items-center gap-1.5 border-b-[1.5px] focus:outline-none">
              <p className="items-center text-sm font-extrabold">
                ({priority})
              </p>
              <IconEdit className="size-3.5" />
            </PopoverButton>
            <PopoverPanel
              transition
              anchor="bottom"
              className="bg-base-bg/90 rounded-lg py-2 text-sm/6 backdrop-blur-2xl transition duration-100 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
            >
              <div className="w-28">
                {['Standard', 'Fast', 'Turbo'].map((prt, idx) => (
                  <PopoverButton
                    key={idx}
                    onClick={() => setPriority(prt)}
                    className="hover:bg-title/10 w-full cursor-pointer rounded-md px-4 py-1 font-semibold"
                  >
                    {prt}
                  </PopoverButton>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
        </div>
      </div>
      <button className="bg-title text-base-bg mt-4 h-12 w-full cursor-pointer rounded-lg text-lg font-bold hover:opacity-80">
        Withdraw
      </button>
    </>
  );
};

export default TabWithdraw;
