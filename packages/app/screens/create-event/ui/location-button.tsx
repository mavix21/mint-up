import { MapPin, Globe } from '@tamagui/lucide-icons';
import { formatLocationText, getLocationColor } from 'app/shared';
import { Button, SizableText } from 'tamagui';

import { EventLocation } from '../../../entities';

export interface LocationButtonProps {
  location?: EventLocation;
  onPress: () => void;
}

export function LocationButton({ location, onPress }: LocationButtonProps) {
  const getLocationIcon = () => {
    if (!location) {
      return <MapPin size={16} />;
    }
    return location.type === 'in-person' ? <MapPin size={16} /> : <Globe size={16} />;
  };

  return (
    <Button
      justifyContent="space-between"
      backgroundColor="$color3"
      iconAfter={getLocationIcon()}
      onPress={onPress}
    >
      <SizableText>Location</SizableText>
      <SizableText
        color={
          getLocationColor(
            location,
            (l) => l.type,
            (l) => (l.type === 'in-person' ? l.address : ''),
            (l) => (l.type === 'online' ? l.url : '')
          ) as any
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
