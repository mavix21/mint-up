'use client';

import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Button, XStack, YStack } from '@my/ui';
import { MyEventsScreen } from 'app/screens/my-events/my-events-screen';
import { useEffect, useState } from 'react';

import { BottomTabNav } from '../_components/BottomTabNav';
import { CreateEventSheetWrapper } from '../_components/CreateEventSheetWrapper';

export default function HomePage() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('my-events');
  // The setFrameReady() function is called when your mini-app is ready to be shown
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <>
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        height={'100vh' as any}
        position="relative"
        gap={20}
        bg="$background"
      >
        <BottomTabNav
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'create') {
              setOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
        />
        {activeTab === 'my-events' && <MyEventsScreen />}
      </YStack>
      <CreateEventSheetWrapper open={open} setOpen={setOpen} />
    </>
  );
}
