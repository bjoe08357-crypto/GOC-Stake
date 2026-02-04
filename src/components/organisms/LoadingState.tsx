import Image from 'next/image';

export const LoadingState: React.FC = () => {
  return (
    <div className="bg-base-bg absolute inset-0 z-50 flex items-center justify-center">
      <Image
        src="/assets/goc-token.svg"
        alt="BOB loading"
        className="h-40 w-40"
        loading="lazy"
        width={160}
        height={160}
      />
    </div>
  );
};
