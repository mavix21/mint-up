import { CommunitiesScreen } from 'app/screens/communities/communities-screen';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'Communities',
        }}
      />
      <CommunitiesScreen />
    </SafeAreaView>
  );
}
