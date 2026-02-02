'use client';

import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { IMAGE_PATH } from '@/utils/constant';
import { Header, LoadingState } from '@/components/organisms';
import TabStake from '@/components/organisms/home/TabStake';
import SectionInfo from '@/components/organisms/home/SectionInfo';
import TabWithdraw from '@/components/organisms/home/TabWithdraw';
import { weiToToken } from '@/utils/helpers';
import { useGeneral } from '@/context/GeneralContext';
import { Modal } from '@/components/atoms';
import Link from 'next/link';
import { TOKEN } from '@/lib/const';

export default function Home() {
  // * State
  const [tab, setTab] = useState<number>(0);
  const [openModalBuyToken, setOpenModalBuyToken] = useState<boolean>(false);

  // * Const
  const initGlobalStaked = 8000000; // 8 million GOC
  const initUniqueStakers = 500; // 500 unique stakers

  // * Functions
  const renderTab = () => {
    switch (tab) {
      case 0:
        return <TabStake setOpenModalBuyToken={setOpenModalBuyToken} />;
      case 1:
        return <TabWithdraw setTab={setTab} />;
      default:
        return <TabStake setOpenModalBuyToken={setOpenModalBuyToken} />;
    }
  };

  const { uniqueStakersCount, totalStaked, isLoading } = useGeneral();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <Modal
        title={`Buy ${TOKEN.shortSymbol} Token`}
        isOpen={openModalBuyToken}
        onClose={() => setOpenModalBuyToken(false)}
        description={`Amount exceeds available ${TOKEN.shortSymbol} tokens. Please top up your token to continue.`}
      >
        <div className="grid w-full grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setOpenModalBuyToken(false)}
            className="bg-content/20 text-content/60 hover:bg-content/30 hover:text-content/70 flex h-9 w-full cursor-pointer items-center justify-center rounded-md font-semibold"
          >
            Cancel
          </button>
          <Link
            target="_blank"
            href="https://indodax.com/market/GOCIDR"
            className="bg-title/90 hover:bg-title flex h-9 w-full items-center justify-center rounded-md"
          >
            <p className="text-base-bg/80 font-semibold">
              Buy {TOKEN.shortSymbol}
            </p>
          </Link>
        </div>
      </Modal>
      <div
        className="bg-cover bg-center pt-[90px]"
        style={{
          backgroundImage: `url(${IMAGE_PATH.bg3})`,
        }}
      >
        <Header />
        <div style={{ backdropFilter: 'blur(60px)' }} className="pb-10">
          <div className="mx-auto min-h-[80vh] max-w-[1536px] p-4 sm:p-16">
            <div className="grid min-h-[65vh] grid-cols-1 gap-36 xl:grid-cols-2">
              <div className="mt-10 sm:mt-22">
                <h1 className="text-center text-4xl leading-14 sm:text-left sm:text-5xl">
                  Earn{' '}
                  <span className="text-title font-extrabold">
                    {TOKEN.shortSymbol}
                  </span>{' '}
                  token by staking
                </h1>
                <div className="bg-base-bg/50 mt-12 grid grid-cols-2 rounded-xl py-7 backdrop-blur-md">
                  <div>
                    <p className="text-content/70 text-center text-xs font-medium tracking-wider">
                      Global{' '}
                      <span className="text-title">{TOKEN.shortSymbol}</span>{' '}
                      Staked:
                    </p>
                    <p className="mt-4 text-center text-xl font-bold">
                      {parseFloat(
                        weiToToken(
                          BigInt(initGlobalStaked * 10 ** 18) +
                            (totalStaked
                              ? BigInt(totalStaked.toString())
                              : BigInt(0))
                        )
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-content/70 text-center text-xs font-medium tracking-wider">
                      Unique Addresses:
                    </p>
                    <p className="mt-4 text-center text-xl font-bold">
                      {(
                        BigInt(initUniqueStakers) +
                        (uniqueStakersCount
                          ? BigInt(uniqueStakersCount.toString())
                          : BigInt(0))
                      )?.toString()}
                    </p>
                  </div>
                </div>
                <div className="text-content/90 mt-12 text-center text-sm font-semibold tracking-wide sm:text-left sm:text-[15px]">
                  {`${TOKEN.name} leads the world in merging NFC technology with innovative
              apparel, revolutionizing user experiences with seamless Web3
              integration on the Ethereum blockchain. Leveraging Ethereum's
              robust, secure, and transparent ecosystem, ${TOKEN.name} ensures
              unparalleled authenticity and traceability in fashion tech. Choose
              ${TOKEN.name} for the ultimate blend of tech, fashion, and decentralized
              connectivity. Embrace the future with ${TOKEN.name}.`}
                </div>
              </div>
              <div>
                <div className="-mb-[1px] flex">
                  {['Stake', 'Withdraw'].map((tb, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTab(idx)}
                      className={twMerge(
                        'bg-base-bg z-[1] h-8 w-full rounded-t-lg border text-sm font-semibold sm:w-33',
                        idx === tab
                          ? 'border-title/30 text-title border-b-title/0'
                          : 'text-content/40 border-title/10 border-b-title/30 cursor-pointer'
                      )}
                    >
                      {tb}
                    </button>
                  ))}
                </div>
                <div
                  className={twMerge(
                    'bg-base-bg border-title/30 flex min-h-80 flex-col rounded-b-lg border p-3 sm:rounded-tr-lg sm:p-8'
                  )}
                >
                  {renderTab()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: -50,
          height: 100,
          marginBottom: -50,
          backdropFilter: 'blur(15px)',
        }}
      />
      <SectionInfo />
    </>
  );
}
