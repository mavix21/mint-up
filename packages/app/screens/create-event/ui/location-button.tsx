import { MapPin, Globe } from '@tamagui/lucide-icons';
import { Button, Text, XStack } from 'tamagui';

import { EventLocation } from './event-location-sheet';

export interface LocationButtonProps {
  location?: EventLocation;
  onPress: () => void;
}

export function LocationButton({ location, onPress }: LocationButtonProps) {
  const getLocationText = () => {
    if (!location) {
      return 'Offline location or virtual link';
    }

    if (location.type === 'in-person') {
      return location.address || 'Add address';
    } else {
      return location.url || 'Add meeting URL';
    }
  };

  const getLocationIcon = () => {
    if (!location) {
      return <MapPin size={16} />;
    }
    return location.type === 'in-person' ? <MapPin size={16} /> : <Globe size={16} />;
  };

  const getLocationColor = () => {
    if (!location) {
      return '$color11';
    }

    if (location.type === 'in-person' && location.address) {
      return '$color12';
    }

    if (location.type === 'virtual' && location.url) {
      return '$color12';
    }

    return '$color11';
  };

  return (
    <Button
      justifyContent="space-between"
      backgroundColor="$color3"
      iconAfter={getLocationIcon()}
      onPress={onPress}
    >
      <Text>Location</Text>
      <Text color={getLocationColor()} ml="$2" numberOfLines={1} flex={1} textAlign="right">
        {getLocationText()}
      </Text>
    </Button>
  );
}
