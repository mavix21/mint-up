import type { Metadata, Viewport } from 'next';

import { Providers } from '@/providers';

import '@coinbase/onchainkit/styles.css';
import './app.css';

export const metadata: Metadata = {
  title: 'Mini',
  description: 'Mini',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  interactiveWidget: 'resizes-content',
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
