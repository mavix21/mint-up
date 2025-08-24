'use client';

import { FullscreenSpinner, PageContainer, YStack } from '@my/ui';
import { useSignIn } from 'app/shared/lib/hooks/use-sign-in';
import { useState } from 'react';

import { BottomTabNav } from './BottomTabNav';
import { CreateEventSheetWrapper } from './CreateEventSheetWrapper';
import { Topbar } from './Topbar';
import { useAuthGateDialog } from './auth/auth-gate-dialog.context';

import { useMiniApp } from '@/contexts/mini-app.context';

export function Navigator({ children }: { children: React.ReactNode }) {
  const { isFrameReady } = useMiniApp();
  const [openCreateEvent, setOpenCreateEvent] = useState(false);
  const { open } = useAuthGateDialog();

  const { isSignedIn, isLoading } = useSignIn();

  if (!isFrameReady) {
    return <FullscreenSpinner />;
  }

  const openCreateEventFormSheet = () => {
    // Prevent actions while authentication is loading
    if (isLoading) {
      return;
    }

    if (!isSignedIn) {
      open({ key: 'createEvent' });
      return;
    }
    setOpenCreateEvent(true);
  };

  return (
    <>
      <PageContainer position="relative">
        <Topbar />
        <YStack flex={1} width="100%" height="100%" overflow="hidden">
          {/* <TabSelector activeTab={activeTab} /> */}
          {children}
        </YStack>
        <BottomTabNav mainButtonAction={openCreateEventFormSheet} />
      </PageContainer>
      <CreateEventSheetWrapper open={openCreateEvent} setOpen={setOpenCreateEvent} />
    </>
  );
}
