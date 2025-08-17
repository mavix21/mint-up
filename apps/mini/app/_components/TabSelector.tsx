import { ExploreEventsScreen } from 'app/screens/explore-events/explore-events-screen';
import { MyEventsScreen } from 'app/screens/my-events/my-events-screen';
import { memo } from 'react';

import { TestPage } from '../_pages/TestPage';

export const TabSelector = memo(function TabSelector({ activeTab }: { activeTab: string }) {
  return (
    <>
      {activeTab === 'my-events' && <MyEventsScreen />}
      {activeTab === 'explore-events' && <ExploreEventsScreen />}
      {activeTab === 'settings' && <TestPage />}
    </>
  );
});
