import React from 'react';
import { TOKEN } from '@/lib/const';

const DetailHeroes = () => {
  return (
    <>
      <h3 className="text-content text-center text-lg font-semibold">
        {TOKEN.name} Heroes Fund: Giving Back to the Game
      </h3>

      <p className="text-content/80 text-sm font-medium">
        {TOKEN.name} isn&apos;t just about games; it&apos;s about giving back to those
        who dedicate their lives to sports. The {TOKEN.name} Heroes Fund
        allocates a small percentage of transaction fees on the platform. These
        collected funds are then divided into two main initiatives:
      </p>

      <p className="text-content/80 ml-6 text-sm font-medium">
        <strong className="text-content">Legend Compassion Charity:</strong>{' '}
        This program focuses on supporting retired athletes who served their
        nation but now face financial difficulties. Funds are used to improve
        their quality of life and ensure they are properly cared for after their
        athletic careers.
      </p>

      <p className="text-content/80 ml-6 text-sm font-medium">
        <strong className="text-content">
          {TOKEN.name} Talent Development Initiative:
        </strong>{' '}
        This scholarship program assists talented young athletes who lack the
        financial resources to pursue their dreams in sports. Funds are
        distributed to football schools and sports academies to support the
        education and training of these future stars.
      </p>

      <p className="text-content/80 text-sm font-medium">
        By participating in {TOKEN.name}, you&apos;re not just investing in a
        token, you&apos;re contributing to a meaningful cause that helps legends
        of the past and cultivates future champions.
      </p>
    </>
  );
};

export default DetailHeroes;
