'use client';

import { ToastProvider } from 'app/provider/toast';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { AuthKitProvider } from './AuthKitProvider';
import { ConvexClientProvider } from './ConvexProvider';
import { MiniKitContextProvider } from './MiniKitProvider';
import { NextTamaguiProvider } from './NextTamaguiProvider';

import { MiniAppProvider } from '@/contexts/mini-app.context';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { baseSepolia } from 'viem/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  // Configuración de wagmi (esto es lo que hace internamente el repositorio)
  const config = createConfig({
    chains: [baseSepolia],
    connectors: [
      coinbaseWallet({
        appName: 'Tu App Name',
        preference: 'smartWalletOnly', // Para MiniKit
      }),
    ],
    transports: {
      [baseSepolia.id]: http(),
    },
  });

  const queryClient = new QueryClient();

  return (
    <AuthKitProvider>
      <ConvexClientProvider session={session}>
        <WagmiProvider config={config}>
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
