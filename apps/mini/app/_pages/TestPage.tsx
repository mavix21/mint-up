import { Text, View } from '@my/ui';

export function TestPage() {
  return (
    <View overflow="hidden" style={{ overscrollBehavior: 'contain' }}>
      <Text>TestPage</Text>
    </View>
  );
}
