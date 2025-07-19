// import { DrawerMenu } from '@my/app/features/drawer-menu'
import { Paragraph, YStack } from '@my/ui';
import { Stack } from 'expo-router';

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
      {/* <DrawerMenu /> */}
      <YStack>
        <Paragraph>Profile</Paragraph>
      </YStack>
    </>
  );
}
