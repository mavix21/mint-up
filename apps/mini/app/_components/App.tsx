import { YStack } from '@my/ui';

import { Navigator } from './Navigator';

export default function App() {
  console.log('App');
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      position="relative"
      height={'100svh' as any}
      bg="$background"
    >
      <Navigator />
    </YStack>
  );
}
