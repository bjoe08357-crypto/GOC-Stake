import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import 'rc-slider/assets/index.css';
import './globals.css';
import { UserProvider } from '@/context/UserContext';
import { GeneralProvider } from '@/context/GeneralContext';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/const';
import { headers } from 'next/headers';
import Web3ContextProvider from '@/providers/Web3Provider';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const cookies = h.get('cookie');
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`}>
        <Web3ContextProvider cookies={cookies}>
          <GeneralProvider>
            <UserProvider>{children}</UserProvider>
          </GeneralProvider>
        </Web3ContextProvider>
      </body>
    </html>
  );
}
