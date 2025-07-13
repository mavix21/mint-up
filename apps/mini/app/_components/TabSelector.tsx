import { MyEventsScreen } from 'app/screens/my-events/my-events-screen';
import { memo } from 'react';

export const TabSelector = memo(function TabSelector({ activeTab }: { activeTab: string }) {
  return <>{activeTab === 'my-events' && <MyEventsScreen />}</>;
});
