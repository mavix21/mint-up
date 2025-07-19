// import { ProfileScreen } from '@my/app/features/profile/screen'
import { Paragraph, YStack } from '@my/ui';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer
      drawerContent={() => (
        <YStack>
          <Paragraph>Profile</Paragraph>
        </YStack>
      )}
    />
  );
}
