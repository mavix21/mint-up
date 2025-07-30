import {
  useVisualViewportHeight,
  Input,
  TextArea,
  Label,
  ToggleGroup,
  Separator,
  SizableText,
  Sheet,
  Button,
  XStack,
  YStack,
} from '@my/ui';
import { MapPin, Globe } from '@tamagui/lucide-icons';
import { AnyFieldApi } from '@tanstack/react-form';
import { useState } from 'react';

import { EventLocation } from '../../../entities';

export interface EventLocationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: EventLocation;
  onLocationChange: (location: EventLocation) => void;
  fieldApi?: AnyFieldApi;
}

export function EventLocationSheet({
  open,
  onOpenChange,
  location,
  onLocationChange,
}: EventLocationSheetProps) {
  const visualViewportHeight = useVisualViewportHeight();

  const [localLocation, setLocalLocation] = useState<EventLocation>(location);

  const handleSave = () => {
    onLocationChange(localLocation);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalLocation(location);
    onOpenChange(false);
  };

  // Reset local state when sheet opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalLocation(location);
    }
    onOpenChange(isOpen);
  };

  const updateLocation = (updates: Partial<EventLocation>) => {
    setLocalLocation((prev) => {
      const updatedLocation = { ...prev, ...updates } as EventLocation;

      // Ensure the location has the correct structure for its type
      if (updatedLocation.type === 'online') {
        // For online locations, ensure only type and url properties
        return {
          type: 'online' as const,
          url: updatedLocation.url || '',
        } as EventLocation;
      }

      // For in-person locations, ensure type, address, and optional instructions
      return {
        type: 'in-person' as const,
        address: updatedLocation.address || '',
        instructions: updatedLocation.instructions,
      } as EventLocation;
    });
  };

  return (
    <Sheet
      open={open}
      forceRemoveScrollEnabled={open}
      onOpenChange={handleOpenChange}
      snapPoints={[90]}
      defaultPosition={0}
      modal
      dismissOnOverlayPress
      dismissOnSnapToBottom
    >
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="$shadowColor"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle backgroundColor="$color2" />
      <Sheet.Frame
        padding="$4"
        backgroundColor="$color2"
        key={visualViewportHeight}
        style={{ height: visualViewportHeight }}
      >
        <YStack gap="$4" width="100%" flex={1} maxWidth={496} marginInline="auto">
          {/* Event Type Selection */}
          <YStack gap="$3">
            <SizableText fontSize="$4" fontWeight="500">
              Event Type
            </SizableText>
            <ToggleGroup
              type="single"
              value={localLocation.type}
              onValueChange={(value: EventLocation['type']) => {
                if (!value) return;
                if (value === 'online') {
                  // When switching to online, ensure we have url property
                  updateLocation({
                    type: 'online',
                    url: '',
                  });
                } else {
                  // When switching to in-person, ensure we have address property
                  updateLocation({
                    type: 'in-person',
                    address: '',
                    instructions: '',
                  });
                }
              }}
              backgroundColor="$color4"
              borderRadius="$4"
              orientation="horizontal"
              size="$3"
            >
              <ToggleGroup.Item
                value="in-person"
                flex={1}
                backgroundColor="transparent"
                borderRadius="$4"
              >
                <XStack alignItems="center" gap="$2">
                  <MapPin size={16} />
                  <SizableText fontWeight="500">In Person</SizableText>
                </XStack>
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="online"
                flex={1}
                backgroundColor="transparent"
                borderRadius="$4"
              >
                <XStack alignItems="center" gap="$2">
                  <Globe size={16} />
                  <SizableText fontWeight="500">Online</SizableText>
                </XStack>
              </ToggleGroup.Item>
            </ToggleGroup>
          </YStack>

          <Separator />

          {/* Location Details */}
          <YStack gap="$4" flex={1}>
            {localLocation.type === 'in-person' ? (
              <>
                <YStack gap="$1">
                  <Label htmlFor="address" fontWeight="500">
                    Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="Enter event address"
                    value={localLocation.address || ''}
                    onChangeText={(text) => updateLocation({ address: text })}
                    backgroundColor="$color4"
                    borderColor="$color5"
                    borderRadius="$4"
                  />
                </YStack>

                <YStack gap="$1" flex={1}>
                  <Label htmlFor="instructions" fontWeight="500">
                    Additional Instructions
                  </Label>
                  <TextArea
                    id="instructions"
                    placeholder="Enter any additional instructions for attendees (e.g., building access, parking info)"
                    value={localLocation.instructions || ''}
                    onChangeText={(text) => updateLocation({ instructions: text })}
                    backgroundColor="$color4"
                    borderColor="$color5"
                    borderRadius="$4"
                    flex={1}
                    minHeight={100}
                  />
                </YStack>
              </>
            ) : (
              <YStack gap="$2">
                <Label htmlFor="url" fontSize="$3" fontWeight="500">
                  Event URL
                </Label>
                <Input
                  id="url"
                  keyboardType="url"
                  placeholder="Enter meeting URL (Zoom, Google Meet, etc.)"
                  value={localLocation.url || ''}
                  onChangeText={(text) => updateLocation({ url: text })}
                  backgroundColor="$color4"
                  borderColor="$color5"
                  borderRadius="$4"
                />
                <SizableText fontSize="$2" color="$color10" mt="$1">
                  Share the link where attendees can join the online event
                </SizableText>
              </YStack>
            )}
          </YStack>

          {/* Action Buttons */}
          <XStack gap="$3" py="$4">
            <Button flex={1} theme="red" onPress={handleCancel}>
              Cancel
            </Button>
            <Button
              flex={1}
              themeInverse
              onPress={handleSave}
              disabled={
                localLocation.type === 'in-person'
                  ? !localLocation.address?.trim()
                  : !localLocation.url?.trim()
              }
            >
              Save Location
            </Button>
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
