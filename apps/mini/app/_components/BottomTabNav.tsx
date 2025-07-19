import { XStack, YStack } from '@my/ui';
import { Calendar, Cast, Plus, Search, Settings } from '@tamagui/lucide-icons';

import { BottomTab } from './BottomTab';

interface BottomTabNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomTabNav({ activeTab, setActiveTab }: BottomTabNavProps) {
  return (
    <YStack bg="$color2" borderTopWidth={1} borderColor="$borderColor" width="100%">
      <XStack flex={1} alignItems="center" justifyContent="space-around" py="$2">
        <BottomTab
          onClick={() => setActiveTab('my-events')}
          isActive={activeTab === 'my-events'}
          label="My Events"
          Icon={Calendar}
        />
        <BottomTab
          onClick={() => setActiveTab('casts')}
          isActive={activeTab === 'casts'}
          label="Casts"
          Icon={Cast}
        />
        <BottomTab
          onClick={() => setActiveTab('create')}
          isActive={activeTab === 'create'}
          isCenter
          label="Create"
          Icon={Plus}
        />
        <BottomTab
          onClick={() => setActiveTab('explore')}
          isActive={activeTab === 'explore'}
          label="Explore"
          Icon={Search}
        />
        <BottomTab
          onClick={() => setActiveTab('settings')}
          isActive={activeTab === 'settings'}
          label="Settings"
          Icon={Settings}
        />
      </XStack>
    </YStack>
  );
}
