import { Text, YStack } from '@my/ui';

import { ThemeSwitch } from '../_components/ThemeSwticher';

export default function SettingsPage() {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" height="100%">
      <Text>Settings</Text>
      <ThemeSwitch />
    </YStack>
  );
}
