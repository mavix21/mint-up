'use client';

import { YStack } from '@my/ui';
import { useSignIn } from 'app/shared/lib/hooks/use-sign-in';
import { useState } from 'react';

import { BottomTabNav } from './BottomTabNav';
import { CreateEventSheetWrapper } from './CreateEventSheetWrapper';
import { SignInPromptModal } from './SignInPromptModal';
import { Topbar } from './Topbar';

export const Navigator = function Navigator({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const { isSignedIn, isLoading } = useSignIn();

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
};
