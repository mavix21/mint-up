// import { SettingsScreen } from 'app/features/settings/screen'
import { Paragraph, YStack } from '@my/ui';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Settings',
        }}
      />
      {/* <SettingsScreen /> */}
      <YStack>
        <Paragraph>Settings</Paragraph>
      </YStack>
    </SafeAreaView>
  );
}
