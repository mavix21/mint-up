'use client';

import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Spinner, Theme, YStack } from '@my/ui';
import { useEffect } from 'react';

import { Navigator } from '@/app/_components/Navigator';

export default function MiniAppLayout({ children }: { children: React.ReactNode }) {
  const { setFrameReady, isFrameReady } = useMiniKit();

  // The setFrameReady() function is called when your mini-app is ready to be shown
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady().then(() => console.log('Mini app loaded'));
    }
  }, [setFrameReady, isFrameReady]);
  console.log('MiniAppLayout');

  if (!isFrameReady) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" height={'100vh' as any}>
        <Theme name="green">
          <Spinner size="large" color="$color10" />
        </Theme>
      </YStack>
    );
  }

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      height={'100vh' as any}
      position="relative"
      gap={20}
      bg="$background"
    >
      <Navigator />
      {children}
    </YStack>
  );
}
