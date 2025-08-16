import { ShareableEventDescriptionScreen } from '@my/app/screens/shareable-event-description-screen/shareable-event-description-screen';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'Shareable Event Description Screen',
        }}
      />
      <ShareableEventDescriptionScreen />
    </SafeAreaView>
  );
}
