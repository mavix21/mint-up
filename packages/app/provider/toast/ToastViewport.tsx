'use client';

import { ToastViewport as ToastViewportOg } from '@my/ui';
import dynamic from 'next/dynamic';

export interface ToastViewportProps {
  noSafeArea?: boolean;
}

// Create a client-side only version to prevent hydration mismatches
const ClientToastViewport = ({ noSafeArea }: ToastViewportProps) => {
  return (
    <ToastViewportOg
      left={noSafeArea ? 0 : 10}
      right={noSafeArea ? 0 : 10}
      top={noSafeArea ? 0 : 10}
      portalToRoot
    />
  );
};

// Dynamically import with no SSR to prevent hydration issues
export const ToastViewport = dynamic(() => Promise.resolve(ClientToastViewport), {
  ssr: false,
});
