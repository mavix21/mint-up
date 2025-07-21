import { Card, Avatar, YStack } from 'tamagui';

export interface EventImageProps {
  imageUrl?: string;
  onPress?: () => void;
}

export function EventImage({ imageUrl, onPress }: EventImageProps) {
  return (
    <Card
      size="$6"
      width="100%"
      height={180}
      backgroundColor="$color4"
      borderRadius="$6"
      overflow="hidden"
      onPress={onPress}
    >
      <YStack flex={1} alignItems="flex-end" justifyContent="flex-end" p="$3">
        <Avatar circular size="$4" backgroundColor="$color2">
          <Avatar.Fallback bc="$color2" />
        </Avatar>
      </YStack>
    </Card>
  );
}
