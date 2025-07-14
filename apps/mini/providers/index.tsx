'use client';

import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { ConvexClientProvider } from './ConvexProvider';
import { MiniKitContextProvider } from './MiniKitProvider';
import { NextTamaguiProvider } from './NextTamaguiProvider';

export function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider session={session}>
      <NextTamaguiProvider>
        <MiniKitContextProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </MiniKitContextProvider>
      </NextTamaguiProvider>
    </SessionProvider>
  );
}
