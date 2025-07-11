import { MyEventsScreen } from '@my/app/screens/my-events/my-events-screen';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'My Events',
        }}
      />
      <MyEventsScreen />
    </SafeAreaView>
  );
}
