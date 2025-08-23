import { XStack, YStack } from '@my/ui';
import { Calendar, Plus, Search, Users } from '@tamagui/lucide-icons';
import { useSession } from 'next-auth/react';

import { BottomTab } from './BottomTab';

import { useMiniApp } from '@/contexts/mini-app.context';

interface BottomTabNavProps {
  mainButtonAction: () => void;
}

export function BottomTabNav({ mainButtonAction: openCreateEventFormSheet }: BottomTabNavProps) {
  const { context } = useMiniApp();
  const { data: session } = useSession();

  return (
    <YStack bg="$color2" borderTopWidth={1} borderColor="$borderColor" py="$3">
      <XStack alignItems="center">
        <BottomTab type="link" href="/my-events" Icon={Calendar} />
        <BottomTab type="link" href="/explore-events" Icon={Search} />
        <BottomTab type="main" mainButtonAction={openCreateEventFormSheet} Icon={Plus} />
        <BottomTab type="link" href="/communities" Icon={Users} />
        <BottomTab
          type="profile"
          avatarUrl={context?.user.pfpUrl ?? session?.user.image}
          href={`/profile/${session?.user.id}`}
        />
      </XStack>
    </YStack>
  );
}
