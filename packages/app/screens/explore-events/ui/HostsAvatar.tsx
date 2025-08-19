import { Circle, XStack, Avatar } from '@my/ui';

export function HostsAvatar({ name, imageUrl }: { name: string; imageUrl: string | null }) {
  return (
    <XStack gap="$2" alignItems="center">
      {imageUrl ? (
        <Avatar circular size="$2">
          <Avatar.Image accessibilityLabel={name} src={imageUrl ?? ''} />
          <Avatar.Fallback delayMs={600} backgroundColor="$background" />
        </Avatar>
      ) : (
        <Circle size="$2" backgroundColor="$color10" />
      )}
    </XStack>
  );
}
