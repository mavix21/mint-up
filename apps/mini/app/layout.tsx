import type { Metadata } from 'next';

import { NextTamaguiProvider } from './NextTamaguiProvider';

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
        <NextTamaguiProvider>{children}</NextTamaguiProvider>
      </body>
    </html>
  );
}
