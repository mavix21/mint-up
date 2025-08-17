'use client';

import { YStack } from '@my/ui';
import { useSignIn } from 'app/shared/lib/hooks/use-sign-in';
import { memo, useState } from 'react';

import { BottomTabNav } from './BottomTabNav';
import { CreateEventSheetWrapper } from './CreateEventSheetWrapper';
import { SignInPromptModal } from './SignInPromptModal';
import { TabSelector } from './TabSelector';
import { Topbar } from './Topbar';

export const Navigator = memo(function Navigator() {
  const [activeTab, setActiveTab] = useState('my-events');
  const [open, setOpen] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const { isSignedIn, isLoading } = useSignIn();

  const handleTabChange = (tab: string) => {
    // Prevent actions while authentication is loading
    if (isLoading) {
      return;
    }

    if (tab === 'create') {
      if (!isSignedIn) {
        setShowSignInPrompt(true);

        return;
      }
      setOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <YStack
        width="100%"
        flex={1}
        height={'100vh' as any}
        position="relative"
        overflowBlock="hidden"
        style={{
          overscrollBehavior: 'none',
        }}
      >
        <Topbar />
        <YStack
          flex={1}
          width="100%"
          height="100%"
          overflowBlock="hidden"
          style={{
            overscrollBehavior: 'none',
          }}
        >
          <TabSelector activeTab={activeTab} />
        </YStack>
        <BottomTabNav activeTab={activeTab} setActiveTab={handleTabChange} />
      </YStack>
      <CreateEventSheetWrapper open={open} setOpen={setOpen} />
      <SignInPromptModal open={showSignInPrompt} onOpenChange={setShowSignInPrompt} />
    </>
  );
});
