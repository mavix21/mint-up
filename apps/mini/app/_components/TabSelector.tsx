import { MyEventsScreen } from 'app/screens/my-events/my-events-screen';
import { memo } from 'react';

import SettingsPage from '../_pages/SettingsPage';

export const TabSelector = memo(function TabSelector({ activeTab }: { activeTab: string }) {
  return (
    <>
      {activeTab === 'my-events' && <MyEventsScreen />}
      {activeTab === 'settings' && <SettingsPage />}
    </>
  );
});
