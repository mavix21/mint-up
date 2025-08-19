import { Circle, XStack, Avatar } from '@my/ui';
import { ConvexEventWithExtras } from 'app/entities';

export function HostsAvatar({ event }: { event: ConvexEventWithExtras }) {
  return (
    <XStack gap="$2" alignItems="center">
      {event.creator.imageUrl ? (
        <Avatar circular size="$2">
          <Avatar.Image
            accessibilityLabel={event.creator.name}
            src={event.creator.imageUrl ?? ''}
          />
          <Avatar.Fallback delayMs={600} backgroundColor="$background" />
        </Avatar>
      ) : (
        <Circle size="$2" backgroundColor="$backgroundHover" />
      )}
    </XStack>
  );
}
