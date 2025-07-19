'use client';

import { YStack } from '@my/ui';
import { memo, useState } from 'react';

import { BottomTabNav } from './BottomTabNav';
import { CreateEventSheetWrapper } from './CreateEventSheetWrapper';
import { TabSelector } from './TabSelector';

export const Navigator = memo(function Navigator() {
  const [activeTab, setActiveTab] = useState('my-events');
  const [open, setOpen] = useState(false);
  console.log('Navigator');

  return (
    <>
      <YStack
        width="100%"
        height={'100dvh' as any}
        overflowBlock="hidden"
        style={{ overflowY: 'hidden', overflowBlock: 'hidden' }}
      >
        <YStack flex={1} width="100%" height="100%">
          <TabSelector activeTab={activeTab} />
        </YStack>
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
      </YStack>
      <CreateEventSheetWrapper open={open} setOpen={setOpen} />
    </>
  );
});
