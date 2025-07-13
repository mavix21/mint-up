import { XStack, YStack } from '@my/ui';
import { Calendar, Home, Plus, Search } from '@tamagui/lucide-icons';

import { BottomTab } from './BottomTab';

interface BottomTabNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomTabNav({ activeTab, setActiveTab }: BottomTabNavProps) {
  return (
    <YStack
      bg="$color2"
      position={'fixed' as any}
      insetInline={0}
      bottom={0}
      borderTopWidth={1}
      borderColor="$borderColor"
      zIndex={50}
    >
      <XStack flex={1} alignItems="center" justifyContent="space-around" py="$2">
        <BottomTab
          onClick={() => setActiveTab('my-events')}
          isActive={activeTab === 'my-events'}
          Icon={<Calendar />}
          label="My Events"
        />
        <BottomTab
          onClick={() => setActiveTab('create')}
          isActive={activeTab === 'create'}
          Icon={<Plus />}
          isCenter
          label="Create"
        />
        <BottomTab
          onClick={() => setActiveTab('explore')}
          isActive={activeTab === 'explore'}
          Icon={<Search />}
          label="Explore"
        />
      </XStack>
    </YStack>
  );
}
