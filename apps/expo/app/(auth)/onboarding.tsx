// import { OnboardingScreen } from 'app/features/auth/onboarding-screen'
import { Paragraph, YStack } from '@my/ui';
import { Stack } from 'expo-router';

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          title: 'Onboarding',
        }}
      />
      {/* <OnboardingScreen /> */}
      <YStack>
        <Paragraph>Onboarding</Paragraph>
      </YStack>
    </>
  );
}
