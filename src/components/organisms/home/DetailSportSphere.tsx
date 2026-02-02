import React from 'react';
import { TOKEN } from '@/lib/const';

const DetailSportSphere = () => {
  return (
    <>
      <h3 className="text-content text-center text-lg font-semibold">
        SportSphere: Powering Fan Engagement for Sports Organizations
      </h3>

      <p className="text-content/80 text-sm font-medium">
        {TOKEN.name} doesn&apos;t just cater to individual fans; it empowers sports
        organizations as well. {TOKEN.name} serves as an aggregator for sports
        organizations, including football clubs and esports teams, to create and
        launch their own fan tokens. Here&apos;s how it benefits everyone
        involved:
      </p>

      <p className="text-content/80 ml-6 text-sm font-medium">
        <strong className="text-content">For Sports Organizations:</strong>{' '}
        {TOKEN.name} provides the platform and technology for organizations to
        create their own fan tokens, fostering deeper connections with their fan
        bases. Fans can use these tokens to access exclusive content,
        participate in polls and voting, and potentially even receive discounts
        on merchandise.
      </p>

      <p className="text-content/80 ml-6 text-sm font-medium">
        <strong className="text-content">
          For {TOKEN.name} Token Holders:
        </strong>{' '}
        {TOKEN.symbol} tokens act as the liquidity for these fan tokens. This
        means that a portion of {TOKEN.symbol} tokens are used to ensure smooth
        trading of these fan tokens. As more sports organizations join the
        platform, the demand for {TOKEN.symbol} tokens increases, potentially
        driving up their value.
      </p>

      <p className="text-content/80 ml-6 text-sm font-medium">
        <strong className="text-content">For Fans:</strong> Fan tokens offer a
        unique way to engage with their favorite teams and athletes. They can be
        used to purchase exclusive merchandise, gain access to VIP experiences,
        and even participate in decision-making processes within the
        organization.
      </p>

      <p className="text-content/80 text-sm font-medium">
        {TOKEN.name}&apos;s SportSphere fosters a win-win situation for everyone
        involved, creating a more connected and interactive experience
      </p>
    </>
  );
};

export default DetailSportSphere;
