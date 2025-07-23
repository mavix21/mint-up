import { EventDescriptionScreen } from '@my/app/screens/event-description/event-description-screen';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'Event Description',
        }}
      />
      <EventDescriptionScreen />
    </SafeAreaView>
  );
}
