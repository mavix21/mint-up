'use client';

import { Button, Text, YStack } from '@my/ui';
import { signOut, useSession } from 'next-auth/react';

import { ThemeSwitch } from '../_components/ThemeSwitch';

import { onboardingUtils } from '@/lib/utils/onboardingUtils';

export default function SettingsPage() {
  const { data: session } = useSession();

  const handleResetOnboarding = () => {
    onboardingUtils.resetOnboarding();
    // Reload the page to trigger onboarding again
    window.location.reload();
  };

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      height="100%"
      maxWidth={600}
      marginInline="auto"
      gap="$4"
    >
      <Text>Settings</Text>
      <Text>{session?.user.username}</Text>
      <pre>{JSON.stringify(session?.user, null, 2)}</pre>
      <Button onPress={() => signOut()}>Sign Out</Button>
      <ThemeSwitch />

      {/* Development-only reset onboarding button */}
      {process.env.NODE_ENV === 'development' && (
        <Button theme="orange" onPress={handleResetOnboarding}>
          Reset Onboarding (Dev Only)
        </Button>
      )}
    </YStack>
  );
}
