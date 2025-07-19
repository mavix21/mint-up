// import { SignInScreen } from 'app/features/auth/sign-in-screen'
import { Paragraph, YStack } from '@my/ui';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Sign In',
        }}
      />
      {/* <SignInScreen /> */}
      <YStack>
        <Paragraph>Sign In</Paragraph>
      </YStack>
    </SafeAreaView>
  );
}
