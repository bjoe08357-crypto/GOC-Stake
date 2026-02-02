'use client';

import React from 'react';
import { IconError } from '@/icons';
import { Modal } from '@/components/atoms';

type ModalErrorLimitProps = {
  isOpen: boolean;
  onClose: () => void;
};
const ModalErrorLimit: React.FC<ModalErrorLimitProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex w-full flex-col items-center justify-center px-4 sm:px-0">
        <IconError className="text-title size-28" />
        <h3 className="text-content/80 mt-4 text-base font-bold sm:text-xl">
          Exceeds max stake limit per wallet
        </h3>
        <div className="border-title/20 bg-title/5 mt-6 w-full rounded-lg border py-2">
          <p className="text-content/60 text-center text-sm font-semibold sm:text-base">
            This wallet has reached the maximum allowed stake. Try using a
            different wallet.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="bg-title/90 hover:bg-title text-base-bg/80 mt-6 flex h-10 w-full cursor-pointer items-center justify-center rounded-md font-semibold"
        >
          Back
        </button>
      </div>
    </Modal>
  );
};

export default ModalErrorLimit;
