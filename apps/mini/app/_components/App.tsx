import { YStack } from '@my/ui';

import { Navigator } from './Navigator';

export default function App() {
  console.log('App');
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      height={'100vh' as any}
      position="relative"
      gap={20}
      bg="$background"
    >
      <Navigator />
    </YStack>
  );
}
