import type { Metadata } from 'next';

import { MiniKitContextProvider } from '@/providers/MiniKitProvider';
import { NextTamaguiProvider } from '@/providers/NextTamaguiProvider';

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
        <NextTamaguiProvider>
          <MiniKitContextProvider>{children}</MiniKitContextProvider>
        </NextTamaguiProvider>
      </body>
    </html>
  );
}
