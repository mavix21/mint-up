import { XStack, YStack } from '@my/ui';
import { Calendar, Plus, Search } from '@tamagui/lucide-icons';

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
          label="My Events"
          Icon={Calendar}
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
      </XStack>
    </YStack>
  );
}
