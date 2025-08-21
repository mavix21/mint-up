import { MapPin, Globe } from '@tamagui/lucide-icons';
import { EventLocation } from 'app/entities';
import { formatLocationText, getLocationColor } from 'app/shared';
import { Button, GetThemeValueForKey, SizableText } from 'tamagui';

export interface LocationButtonProps {
  location?: EventLocation;
  onPress: () => void;
}

export function LocationButton({ location, onPress }: LocationButtonProps) {
  const getLocationIcon = () => {
    if (!location) {
      return <MapPin flexShrink={0} color="$color11" size={16} />;
    }
    return location.type === 'in-person' ? (
      <MapPin flexShrink={0} color="$color11" size={16} />
    ) : (
      <Globe flexShrink={0} color="$color11" size={16} />
    );
  };

  return (
    <Button
      justifyContent="space-between"
      backgroundColor="$color3"
      icon={getLocationIcon()}
      onPress={onPress}
    >
      <SizableText color="$color11">Location</SizableText>
      <SizableText
        color={
          getLocationColor(
            location,
            (l) => l.type,
            (l) => (l.type === 'in-person' ? l.address : ''),
            (l) => (l.type === 'online' ? l.url : '')
          ) as GetThemeValueForKey<'color'>
        }
        ml="$2"
        numberOfLines={1}
        flex={1}
        textAlign="right"
      >
        {formatLocationText(
          location,
          (l) => l.type,
          (l) => (l.type === 'in-person' ? l.address : ''),
          (l) => (l.type === 'online' ? l.url : '')
        )}
      </SizableText>
    </Button>
  );
}
