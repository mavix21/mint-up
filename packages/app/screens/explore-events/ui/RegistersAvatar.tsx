import { Circle, SizableText, View, XStack } from '@my/ui';
import { ConvexEventWithExtras } from 'app/entities';

import { AvatarGroup } from './AvatarGroup';
import { Item } from './Item';

export function RegistersAvatar({ event }: { event: ConvexEventWithExtras }) {
  // Use registration metadata from event data instead of separate queries
  const registrationCount = event.registrationCount ?? 0;
  const recentRegistrations = event.recentRegistrations ?? [];

  if (registrationCount === 0) {
    return (
      <View height="$1.5" justifyContent="center">
        <SizableText size="$1" color="$color10">
          Be the first to join this event.
        </SizableText>
      </View>
    );
  }

  // Create items for AvatarGroup from recent registrations
  const avatarItems = recentRegistrations.map((registration) => (
    <Item key={registration.userId} size="$2" imageUrl={registration.pfpUrl ?? ''} />
  ));

  // Add remaining count circle if there are more registrations than shown
  const remainingCount = registrationCount - recentRegistrations.length;
  if (remainingCount > 0) {
    avatarItems.push(
      <Circle key="remaining" size="$2" backgroundColor="$color" elevation="$4">
        <SizableText color="$background" fontSize="$1">
          +{remainingCount}
        </SizableText>
      </Circle>
    );
  }

  return (
    <XStack>
      <AvatarGroup size="$3" items={avatarItems} />
    </XStack>
  );
}
