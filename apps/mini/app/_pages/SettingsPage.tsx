'use client';

import { Button, Text, YStack } from '@my/ui';
import { signOut, useSession } from 'next-auth/react';

import { ThemeSwitch } from '../_components/ThemeSwticher';

export default function SettingsPage() {
  const { data: session } = useSession();
  console.log('[SettingsPage] SESSION', session);
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      height="100%"
      maxWidth={600}
      marginInline="auto"
    >
      <Text>Settings</Text>
      <Text>{session?.user.username}</Text>
      <pre>{JSON.stringify(session?.user, null, 2)}</pre>
      <Button onPress={() => signOut()}>Sign Out</Button>
      <ThemeSwitch />
    </YStack>
  );
}
