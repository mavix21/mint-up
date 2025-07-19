// import { PrivacyPolicyScreen } from 'app/features/legal/privacy-policy-screen'
import { Paragraph, YStack } from '@my/ui';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Privacy Policy' }} />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        {/* <PrivacyPolicyScreen /> */}
        <YStack>
          <Paragraph>Privacy Policy</Paragraph>
        </YStack>
      </SafeAreaView>
    </>
  );
}
