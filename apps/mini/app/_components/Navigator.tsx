'use client';

import { FullscreenSpinner, YStack } from '@my/ui';
import { useSignIn } from 'app/shared/lib/hooks/use-sign-in';
import { useState } from 'react';

import { BottomTabNav } from './BottomTabNav';
import { CreateEventSheetWrapper } from './CreateEventSheetWrapper';
import { SignInPromptModal } from './SignInPromptModal';
import { Topbar } from './Topbar';

import { useMiniApp } from '@/contexts/mini-app.context';

export function Navigator({ children }: { children: React.ReactNode }) {
  const { isFrameReady } = useMiniApp();
  const [open, setOpen] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

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
      setShowSignInPrompt(true);

      return;
    }
    setOpen(true);
  };

  return (
    <>
      <YStack
        width="100%"
        height={'100vh' as any}
        position="relative"
        flex={1}
        overflow="hidden"
        style={{
          overscrollBehavior: 'none',
        }}
      >
        <Topbar />
        <YStack
          flex={1}
          width="100%"
          height="100%"
          overflow="hidden"
          isolation="isolate"
          style={{
            overscrollBehavior: 'none',
          }}
        >
          {/* <TabSelector activeTab={activeTab} /> */}
          {children}
        </YStack>
        <BottomTabNav mainButtonAction={openCreateEventFormSheet} />
      </YStack>
      <CreateEventSheetWrapper open={open} setOpen={setOpen} />
      <SignInPromptModal open={showSignInPrompt} onOpenChange={setShowSignInPrompt} />
    </>
  );
}
