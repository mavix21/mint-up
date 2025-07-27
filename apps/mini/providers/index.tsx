'use client';

import { ToastProvider } from 'app/provider/toast';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { AuthKitProvider } from './AuthKitProvider';
import { ConvexClientProvider } from './ConvexProvider';
import { MiniKitContextProvider } from './MiniKitProvider';
import { NextTamaguiProvider } from './NextTamaguiProvider';

import { MiniAppProvider } from '@/contexts/mini-app.context';

export function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return (
    <AuthKitProvider>
      <ConvexClientProvider session={session}>
        <MiniKitContextProvider>
          <MiniAppProvider>
            <NextTamaguiProvider>
              <ToastProvider>{children}</ToastProvider>
            </NextTamaguiProvider>
          </MiniAppProvider>
        </MiniKitContextProvider>
      </ConvexClientProvider>
    </AuthKitProvider>
  );
}
