import React from 'react';
import { TOKEN } from '@/lib/const';

const DetailMembership = () => {
  return (
    <>
      <h3 className="text-content text-center text-lg font-semibold">
        Membership Tiers: Unlock Exclusive Benefits
      </h3>

      <p className="text-content/80 text-sm font-medium">
        Owning {TOKEN.symbol} tokens grants you access to a tiered membership
        program offering a range of exclusive benefits. The more {TOKEN.symbol}{' '}
        you hold, the higher your tier and the greater the rewards. Here&apos;s a
        breakdown of the tiers:
      </p>

      <p className="text-content/80 ml-6 text-sm font-medium">
        <strong className="text-content">
          Bronze Membership (Minimum $1,000 worth of {TOKEN.symbol}):
        </strong>{' '}
        Join a global {TOKEN.name} community platform, receive monthly
        newsletters with market trends and insights, access priority customer
        support with chatbot integration, and earn free {TOKEN.name} merchandise
        by reaching specific milestones.
      </p>

      <p className="text-content/80 ml-6 text-sm font-medium">
        <strong className="text-content">
          Silver Membership (Minimum 5,000 USD worth of {TOKEN.symbol}):
        </strong>{' '}
        Includes all Bronze benefits, plus VIP invitations to exclusive events,
        early access to beta test new features, access to specialized staking
        programs with higher returns, discounts on merchandise, free tickets to
        global sports events, and special ranks in {TOKEN.name} social media
        communities.
      </p>

      <p className="text-content/80 ml-6 text-sm font-medium">
        <strong className="text-content">
          Gold Membership (Minimum 50,000 USD worth of {TOKEN.symbol}):
        </strong>{' '}
        Unlock all Bronze and Silver perks, plus VIP access to all{' '}
        {TOKEN.name}-sponsored events, free attendance at major crypto
        conferences as a {TOKEN.name} guest,
        exclusive investment opportunities, one-on-one mentorship sessions,
        limited-edition customizable merchandise, and the chance to create a
        unique {TOKEN.name} Wear product. Gold members also gain voting rights
        on {TOKEN.name} governance decisions, premium sports event tickets, and
        personal invitations to {TOKEN.name} team gatherings like galas or
        dinners.
      </p>
    </>
  );
};

export default DetailMembership;
