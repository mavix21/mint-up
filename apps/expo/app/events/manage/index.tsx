import { ManageEventScreen } from 'app/screens/manage-event/manage-event-screen';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'Manage Event',
        }}
      />
      <ManageEventScreen />
    </SafeAreaView>
  );
}
