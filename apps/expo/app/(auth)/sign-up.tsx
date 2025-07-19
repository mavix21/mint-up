// import { SignUpScreen } from 'app/features/auth/sign-up-screen'
import { Paragraph, YStack } from '@my/ui';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'Sign Up',
        }}
      />
      {/* <SignUpScreen /> */}
      <YStack>
        <Paragraph>Sign Up</Paragraph>
      </YStack>
    </SafeAreaView>
  );
}
