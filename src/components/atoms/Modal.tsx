'use client';

import clsx from 'clsx';
import { IconClose } from '@/icons';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  titleClassname?: string;
  description?: string;
  children: ReactNode;
  containerStyle?: 'default' | 'large' | 'x-large';
  closeBackdrop?: boolean;
}

const baseStyle = {
  default: 'max-w-lg px-0 sm:px-6 pb-9 pt-6',
  large: 'max-w-2xl px-0 sm:px-4 pb-4 pt-2',
  'x-large': 'max-w-4xl px-0 sm:px-4 pb-4 pt-2',
};

export const Modal: React.FC<IModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  titleClassname,
  containerStyle = 'default',
  closeBackdrop = true,
}) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={closeBackdrop ? onClose : () => {}}
      >
        <div className="bg-base-bg/50 fixed inset-0 backdrop-blur-sm">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel
                    className={clsx(
                      'border-title/20 bg-base-bg w-full transform items-center overflow-hidden rounded-2xl border text-center align-middle transition-all',
                      baseStyle[containerStyle]
                    )}
                  >
                    {closeBackdrop && (
                      <button
                        className="hover:bg-title/10 ml-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-transparent"
                        onClick={onClose}
                      >
                        <IconClose className="h-5 w-5 opacity-50" />
                      </button>
                    )}
                    {title && (
                      <Dialog.Title
                        as="h3"
                        className={clsx(
                          'text-content text-xl font-bold',
                          titleClassname
                        )}
                      >
                        {title}
                      </Dialog.Title>
                    )}
                    {description && (
                      <p className="text-content/60 mt-3 mb-8 text-sm font-medium">
                        {description}
                      </p>
                    )}
                    <div className="flex flex-col items-start">{children}</div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
