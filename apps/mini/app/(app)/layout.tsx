import type { Metadata } from 'next';

import { Providers } from '@/providers';

import '@coinbase/onchainkit/styles.css';
import './app.css';

export const metadata: Metadata = {
  title: 'Mini',
  description: 'Mini',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers session={null}>{children}</Providers>
      </body>
    </html>
  );
}
