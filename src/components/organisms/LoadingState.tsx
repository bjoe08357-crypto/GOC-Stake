import Image from 'next/image';

export const LoadingState: React.FC = () => {
  return (
    <div className="bg-base-bg absolute inset-0 z-50 flex items-center justify-center">
      <Image
        src="/assets/loader.png"
        alt="loader"
        className="h-64 w-64"
        loading="lazy"
        width={256}
        height={256}
      />
    </div>
  );
};
