'use client';

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
      <TabSelector activeTab={activeTab} />
      <CreateEventSheetWrapper open={open} setOpen={setOpen} />
    </>
  );
});
