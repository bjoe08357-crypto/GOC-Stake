import React from 'react';
import { TOKEN } from '@/lib/const';

const DetailGamification = () => {
  return (
    <>
      <h3 className="text-content text-center text-lg font-semibold">
        Gamification: Play, Earn, and Celebrate Your Pass
      </h3>

      <p className="text-content/80 text-sm font-medium">
        {TOKEN.name} goes beyond just buying and selling tokens. It offers a fun
        and engaging way to interact with the world of sports through
        gamification. Here&apos;s how it works:
      </p>

      <p className="text-content/80 ml-6 text-sm font-medium">
        <strong className="text-content">
          {TOKEN.name} Fantasy League
        </strong>{' '}
        Inspired by popular fantasy sports leagues, {TOKEN.name} allows you to
        create virtual teams using real-life athletes. The performance of your
        chosen athletes in actual matches translates into points and rewards for
        you. The top performers in each league are then showered with{' '}
        {TOKEN.symbol} tokens!
      </p>

      <p className="text-content/80 ml-6 text-sm font-medium">
        <strong className="text-content">{TOKEN.name} Mini Games</strong> Prefer
        something quick and engaging? {TOKEN.name} Mini Games offer a variety of
        simple, finger-friendly games like penalty kicks, basketball free
        throws, and sports trivia quizzes. Play for a small entry fee using{' '}
        {TOKEN.symbol} tokens, rack up points based on your performance, and
        convert those points into even more {TOKEN.symbol}! Weekly and monthly
        leaderboards showcase the top players, awarding them with additional{' '}
        {TOKEN.symbol} for their dominance.
      </p>

      <p className="text-content/80 text-sm font-medium">
        These games not only provide entertainment but also incentivize users to
        stay active within the {TOKEN.name} ecosystem, all while celebrating
        their love for sports.
      </p>
    </>
  );
};

export default DetailGamification;
