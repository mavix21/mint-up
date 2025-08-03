import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { Circle, SizableText, Text, XStack, View } from '@my/ui';
import { SkeletonLine } from 'app/shared/ui/SkeletonLine';
import { useQuery } from 'convex/react';

import { AvatarGroup } from './AvatarGroup';
import { Item } from './Item';

export function RegistersAvatar({ eventId }: { eventId: string }) {
  const registers = useQuery(api.registrations.getRegistrationsByEventId, {
    eventId: eventId as Id<'events'>,
  });

  const numberOfTotalRegisters = useQuery(api.registrations.getRegistrationsByEventIdCount, {
    eventId: eventId as Id<'events'>,
  });

  if (!registers) return <SkeletonLine width="$4" height="$1.5" />;

  if (registers?.length < 1)
    return (
      <View height="$1.5" justifyContent="center">
        <SizableText size="$1" color="$color10">
          Be the first to join this event.
        </SizableText>
      </View>
    );

  // Show only first 5 registers
  const visibleRegisters = registers.slice(0, 5);

  // Calculate remaining count
  const remainingCount = (numberOfTotalRegisters || 0) - visibleRegisters.length;

  // Create items for AvatarGroup
  const avatarItems = visibleRegisters.map((register) => (
    <Item key={register._id} size="$2" imageUrl={register.assistant?.pfpUrl ?? ''} />
  ));

  // Add remaining count circle if there are more than 5 total registers
  if (remainingCount > 0) {
    avatarItems.push(
      <Circle key="remaining" size="$2" backgroundColor="$color" elevation="$4">
        <Text color="$background" fontSize="$1">
          +{remainingCount}
        </Text>
      </Circle>
    );
  }

  return (
    <XStack>
      <AvatarGroup size="$3" items={avatarItems} />
    </XStack>
  );
}
