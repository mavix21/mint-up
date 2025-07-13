import { MyEventScreen } from '@my/app/screens/my-event/my-event-screen';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'My Event',
        }}
      />
      <MyEventScreen />
    </SafeAreaView>
  );
}
