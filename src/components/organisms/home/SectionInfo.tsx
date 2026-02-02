import Image from 'next/image';
import { IconDropdown } from '@/icons';
import React, { useState } from 'react';
import { IMAGE_PATH } from '@/utils/constant';
import ModalInfoDetail from './ModalInfoDetail';
import { TOKEN } from '@/lib/const';

const SectionInfo = () => {
  // * State
  const [selectedInfo, setSelectedInfo] = useState<string>('');
  const [openModalDetail, setOpenModalDetail] = useState<boolean>(false);

  // * Const
  const infoContents = [
    {
      image: IMAGE_PATH.heroes,
      title: `${TOKEN.name} Heroes Fund`,
      desc: 'A philanthropic initiative that utilizes a portion of transaction fees to support retired athletes facing financial hardships and young athletes pursuing their sports dreams',
    },
    {
      image: IMAGE_PATH.membership,
      title: 'Membership Tiers',
      desc: `A tiered membership program that rewards holders of ${TOKEN.symbol} tokens with exclusive benefits, ranging from community access and event invitations to merchandise discounts and personalized training sessions`,
    },
    {
      image: IMAGE_PATH.gamification,
      title: 'Gamification',
      desc: `A gamified ecosystem where users can play engaging games and earn ${TOKEN.symbol} tokens as rewards. These tokens can be used within the platform or monetized externally, promoting continuous engagement and utility`,
    },
    {
      image: IMAGE_PATH.sportsphere,
      title: 'SportSphere',
      desc: `A platform that facilitates the creation and launch of fan tokens for sports organizations, including football clubs and esports teams. ${TOKEN.symbol} tokens serve as liquidity for these fan tokens, driving demand and increasing their adoption`,
    },
  ];

  return (
    <>
      <ModalInfoDetail
        isOpen={openModalDetail}
        title={selectedInfo as any}
        onClose={() => {
          setOpenModalDetail(false);
          setTimeout(() => {
            setSelectedInfo('');
          }, 500);
        }}
      />
      <div className="relative mt-0 py-16">
        <div
          className="absolute top-24 left-0 -z-10 h-full w-full bg-cover bg-center opacity-60 blur-[10px]"
          style={{ backgroundImage: `url(${IMAGE_PATH.bg2})` }}
        />
        <div className="mx-auto max-w-[1536px] px-4 sm:px-16">
          <h1 className="text-content/90 mt-6 text-center text-3xl font-bold sm:text-[40px]">
            {`Why Choose ${TOKEN.displayName}?`}
          </h1>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-20 md:grid-cols-2">
            <div className="relative flex flex-col-reverse overflow-hidden rounded-2xl px-4 py-4 sm:px-6 sm:py-5 lg:px-9 lg:py-7 xl:flex-row xl:px-12 xl:py-9">
              <div className="from-title absolute top-0 left-0 -z-[1] h-full w-full bg-gradient-to-br to-[#6B7280] opacity-40" />
              <div
                style={{
                  width: 'calc(100% - 4px)',
                  height: 'calc(100% - 4px)',
                }}
                className="bg-base-bg absolute top-0.5 left-0.5 -z-[2] size-32 rounded-2xl"
              />
              <div>
                <p className="text-content/90 text-[26px] font-bold">
                  Trade Tokens
                </p>
                <p className="text-content/60 mt-2 text-xs font-medium sm:mt-3.5">
                  {`Buy ${TOKEN.displayName} easily, quickly, and securely on your preferred exchange! Track real-time prices and use live charts to guide your trading decisions. Set your own buying or selling price and enjoy a smooth trading experience across supported platforms worldwide. So, what are you waiting for? Join now and start investing in ${TOKEN.displayName} today!`}
                </p>
              </div>
              <Image
                src={IMAGE_PATH.drxToken}
                className="my-auto ml-4 h-33 w-auto object-contain"
                height={100}
                width={100}
                alt=""
              />
            </div>
            <div className="relative flex flex-col-reverse overflow-hidden rounded-2xl px-4 py-4 sm:px-6 sm:py-5 lg:px-9 lg:py-7 xl:flex-row xl:px-12 xl:py-9">
              <div className="from-title absolute top-0 left-0 -z-[1] h-full w-full bg-gradient-to-br to-[#6B7280] opacity-40" />
              <div
                style={{
                  width: 'calc(100% - 4px)',
                  height: 'calc(100% - 4px)',
                }}
                className="bg-base-bg absolute top-0.5 left-0.5 -z-[2] size-32 rounded-2xl"
              />
              <div>
                <p className="text-content/90 text-[26px] font-bold">
                  Elevate Your Lifestyle
                </p>
                <p className="text-content/60 mt-2 text-xs font-medium sm:mt-3.5">
                  {`${TOKEN.name} leads the world in merging NFC technology with innovative
              apparel, revolutionizing user experiences with seamless Web3
              integration on the Ethereum blockchain. Leveraging Ethereum's
              robust, secure, and transparent ecosystem, ${TOKEN.name} ensures
              unparalleled authenticity and traceability in fashion tech. Choose
              ${TOKEN.name} for the ultimate blend of tech, fashion, and decentralized
              connectivity. Embrace the future with ${TOKEN.name}.`}
                </p>
              </div>
              <Image
                src={IMAGE_PATH.lifestyle}
                className="my-auto h-36 w-auto object-contain sm:ml-4"
                height={100}
                width={100}
                alt=""
              />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 xl:gap-5">
            {infoContents.map((ic, idx) => (
              <div
                key={idx}
                className="group relative flex cursor-pointer flex-col items-center overflow-hidden rounded-2xl px-3 pt-3 pb-5 lg:px-4 xl:px-6"
                onClick={() => {
                  setSelectedInfo(ic.title);
                  setOpenModalDetail(true);
                }}
              >
                <div
                  className="bg-base-bg/50 absolute top-full left-0.5 flex flex-col items-center rounded-2xl pt-[30%] backdrop-blur-sm group-hover:top-0.5"
                  style={{
                    width: 'calc(100% - 4px)',
                    height: 'calc(100% - 4px)',
                  }}
                >
                  <p className="bg-title text-base-bg/70 rounded-sm px-2 font-black">
                    READ MORE
                  </p>
                  <IconDropdown className="text-title mt-2 size-3" />
                  <IconDropdown className="text-title -mt-3 size-6" />
                  <IconDropdown className="text-title -mt-6 size-10" />
                </div>
                <div className="from-title absolute top-0 left-0 -z-[2] h-full w-full bg-gradient-to-br to-[#6B7280] opacity-40" />
                <div
                  style={{
                    width: 'calc(100% - 4px)',
                    height: 'calc(100% - 4px)',
                  }}
                  className="bg-base-bg absolute top-0.5 left-0.5 -z-[1] size-32 rounded-2xl"
                />
                <Image
                  src={ic.image}
                  className="my-auto ml-4 size-18 w-auto object-contain"
                  height={100}
                  width={100}
                  alt=""
                />
                <div>
                  <p className="text-content/90 text-center text-sm font-bold sm:text-xl">
                    {ic.title}
                  </p>
                  <p className="text-content/60 mt-3 max-h-16 truncate text-[11px] font-medium text-wrap sm:text-xs">
                    {ic.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionInfo;
