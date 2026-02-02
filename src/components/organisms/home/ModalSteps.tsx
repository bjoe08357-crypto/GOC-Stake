/* eslint-disable no-nested-ternary */

'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Modal } from '@/components/atoms';
import { IconCheck, IconError } from '@/icons';
import { IconSpinner } from '@/icons/IconSpinner';

export type ModalStepStatus = {
  index: number;
  status: 'loading' | 'success' | 'error';
};
type ModalStakeStepsProps = {
  isOpen: boolean;
  title: string;
  desc: string;
  stepList: string[];
  currentStep: ModalStepStatus;
  errorMessage: string;
  onClose: () => void;
};

export const ModalSteps: React.FC<ModalStakeStepsProps> = ({
  isOpen,
  title,
  desc,
  stepList,
  errorMessage,
  currentStep = {
    index: 0,
    status: 'loading',
  },
  onClose,
}) => {
  const stepLength = stepList.length;

  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      description={desc}
      closeBackdrop={false}
    >
      <div
        className={`relative grid w-full`}
        style={{ gridTemplateColumns: `repeat(${stepLength}, minmax(0, 1fr))` }}
      >
        <div
          className="bg-content/20 absolute top-5 -z-10 h-2 -translate-y-1/2 rounded-full"
          style={{
            width: `${(((stepLength - 1) / stepLength) * 100).toFixed(0)}%`,
            left: `${((1 / (stepLength * 2)) * 100).toFixed(0)}%`,
          }}
        />
        <div
          style={{
            transition: 'all 1000ms ease-in-out',
            left: `${((1 / (stepLength * 2)) * 100).toFixed(0)}%`,
            width:
              currentStep.index === 0
                ? '0%'
                : stepLength !== currentStep.index
                  ? `${((currentStep.index / stepLength) * 100).toFixed(0)}%`
                  : `${(((stepLength - 1) / stepLength) * 100).toFixed(0)}%`,
          }}
          className={twMerge(
            'bg-title absolute top-5 -z-10 h-2 -translate-y-1/2 rounded-full'
          )}
        />
        {stepList.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="border-title bg-base-bg flex size-10 items-center justify-center rounded-full border-2">
              {currentStep.index === idx && currentStep.status === 'loading' ? (
                <IconSpinner className="text-title size-5 animate-spin" />
              ) : (
                <>
                  {currentStep.index > idx ? (
                    <IconCheck className="text-title size-5" />
                  ) : (
                    <>
                      {currentStep.index === idx &&
                      currentStep.status === 'error' ? (
                        <IconError className="text-title size-5" />
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            <p className="text-content/80 mt-2 font-semibold">{step}</p>
          </div>
        ))}
      </div>
      <div className="w-full px-4 sm:px-0">
        {currentStep.status === 'error' && (
          <>
            <div className="border-title/20 bg-title/5 mt-6 w-full rounded-lg border py-2">
              <p className="text-content/60 text-center font-semibold">
                {errorMessage === '' ? 'Something went wrong' : errorMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="bg-title/90 hover:bg-title text-base-bg/80 mt-4 flex h-10 w-full cursor-pointer items-center justify-center rounded-md font-semibold"
            >
              Back
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};
