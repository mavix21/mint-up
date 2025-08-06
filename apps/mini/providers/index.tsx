'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from 'app/provider/toast';
import type { Session } from 'next-auth';
import { useState } from 'react';
import { cookieToInitialState, WagmiProvider } from 'wagmi';

import { AuthKitProvider } from './AuthKitProvider';
import { ConvexClientProvider } from './ConvexProvider';
import { MiniKitContextProvider } from './MiniKitProvider';
import { NextTamaguiProvider } from './NextTamaguiProvider';

import { MiniAppProvider } from '@/contexts/mini-app.context';
import { getConfig } from '@/lib/wagmi';

export function Providers({
  session,
  children,
  cookie,
}: {
  session: Session | null;
  children: React.ReactNode;
  cookie: string | null;
}) {
  // Configuración de wagmi (esto es lo que hace internamente el repositorio)
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());
  const initialState = cookieToInitialState(config, cookie);

  return (
    <AuthKitProvider>
      <ConvexClientProvider session={session}>
        <WagmiProvider config={config} initialState={initialState}>
          <QueryClientProvider client={queryClient}>
            <MiniKitContextProvider>
              <MiniAppProvider>
                <NextTamaguiProvider>
                  <ToastProvider>{children}</ToastProvider>
                </NextTamaguiProvider>
              </MiniAppProvider>
            </MiniKitContextProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ConvexClientProvider>
    </AuthKitProvider>
  );
}
