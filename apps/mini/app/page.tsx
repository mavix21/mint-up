'use client';

import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Button, YStack } from '@my/ui';
import { useEffect } from 'react';

export default function HomePage() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  // The setFrameReady() function is called when your mini-app is ready to be shown
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <YStack
      theme="green"
      flex={1}
      justifyContent="center"
      alignItems="center"
      height={'100vh' as any}
      gap={20}
    >
      <YStack bg="$background">
        <Button>Click me</Button>
      </YStack>
    </YStack>
  );
}
