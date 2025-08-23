import { XStack, YStack } from '@my/ui';
import { Calendar, Plus, Search } from '@tamagui/lucide-icons';

import { BottomTab } from './BottomTab';

interface BottomTabNavProps {
  mainButtonAction: () => void;
}

export function BottomTabNav({ mainButtonAction: openCreateEventFormSheet }: BottomTabNavProps) {
  return (
    <YStack bg="$color2" borderTopWidth={1} borderColor="$borderColor" py="$3">
      <XStack alignItems="center">
        <BottomTab type="link" href="/my-events" Icon={Calendar} />
        {/* <BottomTab
          onClick={() => setActiveTab('casts')}
          isActive={activeTab === 'casts'}
          label="Casts"
          Icon={Cast}
        /> */}
        <BottomTab type="main" mainButtonAction={openCreateEventFormSheet} Icon={Plus} />
        <BottomTab type="link" href="/explore-events" Icon={Search} />
      </XStack>
    </YStack>
  );
}
