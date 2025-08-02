import { Avatar } from '@my/ui';
import type { SizeTokens } from '@my/ui';

export function Item({ imageUrl, size }: { imageUrl: string; size: SizeTokens }) {
  return (
    <Avatar size={size} circular>
      <Avatar.Image objectFit="cover" src={imageUrl} backgroundColor="$background" />
      <Avatar.Fallback backgroundColor="$background" />
    </Avatar>
  );
}
