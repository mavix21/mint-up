'use client';

import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { isDevelopment } from 'app/shared/lib/environment';
import { ReactNode } from 'react';
import { base, baseSepolia } from 'viem/chains';

export function MiniKitContextProvider({ children }: { children: ReactNode }) {
  const chain = isDevelopment() ? baseSepolia : base;

  return (
    <MiniKitProvider apiKey={process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY} chain={chain}>
      {children}
    </MiniKitProvider>
  );
}
