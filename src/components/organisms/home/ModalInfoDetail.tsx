/* eslint-disable no-nested-ternary */

'use client';

import React from 'react';
import Image from 'next/image';
import { Modal } from '@/components/atoms';
import { IMAGE_PATH } from '@/utils/constant';
import { TOKEN } from '@/lib/const';
import DetailHeroes from './DetailHeroes';
import DetailMembership from './DetailMembership';
import DetailGamification from './DetailGamification';
import DetailSportSphere from './DetailSportSphere';

const HEROES_TITLE = `${TOKEN.name} Heroes Fund` as const;

type ModalInfoDetailProps = {
  isOpen: boolean;
  title:
    | typeof HEROES_TITLE
    | 'Membership Tiers'
    | 'Gamification'
    | 'SportSphere'
    | '';
  onClose: () => void;
};

const ModalInfoDetail: React.FC<ModalInfoDetailProps> = ({
  isOpen,
  onClose,
  title,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} containerStyle="x-large">
      <div className="text-content space-y-4 p-6 text-left text-base leading-relaxed">
        <Image
          src={IMAGE_PATH.membership}
          className="mx-auto h-36 w-auto object-cover"
          height={200}
          width={200}
          alt=""
        />
        <h2 className="text-title text-center text-2xl font-bold">{title}</h2>
        {title === HEROES_TITLE ? (
          <DetailHeroes />
        ) : title === 'Membership Tiers' ? (
          <DetailMembership />
        ) : title === 'Gamification' ? (
          <DetailGamification />
        ) : (
          <DetailSportSphere />
        )}
      </div>
    </Modal>
  );
};

export default ModalInfoDetail;
