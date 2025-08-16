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
import { useStore } from '@tanstack/react-form';
import { EventLocation } from 'app/entities/schemas';
import { withForm } from 'app/shared/lib/form';
import { useState } from 'react';

import { createEventFormOpts } from '../model/shared-form';

export interface EventLocationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EventLocationSheet = withForm({
  ...createEventFormOpts,
  props: {
    open: false,
    onOpenChange: () => {},
  } as EventLocationSheetProps,
  render: function EventLocationSheet({ open, onOpenChange, form }) {
    const visualViewportHeight = useVisualViewportHeight();
    const [savedValues, setSavedValues] = useState<{
      address?: string;
      instructions?: string;
      url?: string;
    }>({});

    const handleSave = () => {
      onOpenChange(false);
    };

    const handleCancel = () => {
      onOpenChange(false);
    };

    const eventLocationType = useStore(form.store, (state) => state.values.location.type);

    return (
      <Sheet
        open={open}
        forceRemoveScrollEnabled={open}
        onOpenChange={onOpenChange}
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
            <form.AppField
              name="location.type"
              children={(field) => {
                return (
                  <YStack gap="$3">
                    <SizableText fontSize="$4" fontWeight="500">
                      Event Type
                    </SizableText>
                    <ToggleGroup
                      type="single"
                      defaultValue="in-person"
                      disableDeactivation
                      value={eventLocationType}
                      onValueChange={(value: EventLocation['type']) => {
                        if (!value) return;

                        // Save current values before switching
                        const currentLocation = form.getFieldValue('location');
                        if (currentLocation.type === 'in-person') {
                          setSavedValues((prev) => ({
                            ...prev,
                            address: currentLocation.address,
                            instructions: currentLocation.instructions,
                          }));
                        } else if (currentLocation.type === 'online') {
                          setSavedValues((prev) => ({ ...prev, url: currentLocation.url }));
                        }

                        if (value === 'online') {
                          // When switching to online, create a new location object with only online properties
                          form.setFieldValue('location', {
                            type: 'online',
                            url: savedValues.url || '',
                          });
                        } else {
                          // When switching to in-person, create a new location object with only in-person properties
                          form.setFieldValue('location', {
                            type: 'in-person',
                            address: savedValues.address || '',
                            instructions: savedValues.instructions || '',
                          });
                        }
                      }}
                      borderRadius="$4"
                      orientation="horizontal"
                      size="$3"
                    >
                      <ToggleGroup.Item value="in-person" flex={1} borderRadius="$4">
                        <XStack alignItems="center" gap="$2">
                          <MapPin size={16} />
                          <SizableText fontWeight="500">In Person</SizableText>
                        </XStack>
                      </ToggleGroup.Item>
                      <ToggleGroup.Item value="online" flex={1} borderRadius="$4">
                        <XStack alignItems="center" gap="$2">
                          <Globe size={16} />
                          <SizableText fontWeight="500">Online</SizableText>
                        </XStack>
                      </ToggleGroup.Item>
                    </ToggleGroup>
                  </YStack>
                );
              }}
            />

            <Separator />

            {/* Location Details */}
            <YStack gap="$4" flex={1}>
              {eventLocationType === 'in-person' ? (
                <>
                  <form.AppField
                    name="location.address"
                    children={(field) => {
                      return (
                        <YStack gap="$1">
                          <Label htmlFor="address" fontWeight="500">
                            Address
                          </Label>
                          <Input
                            id="address"
                            placeholder="Enter event address"
                            value={field.state.value || ''}
                            onChangeText={(text) => field.handleChange(text)}
                            backgroundColor="$color4"
                            borderColor="$color5"
                            borderRadius="$4"
                          />
                        </YStack>
                      );
                    }}
                  />

                  <form.AppField
                    name="location.instructions"
                    children={(field) => {
                      return (
                        <YStack gap="$1" flex={1}>
                          <Label htmlFor="instructions" fontWeight="500">
                            Additional Instructions
                          </Label>
                          <TextArea
                            id="instructions"
                            placeholder="Enter any additional instructions for attendees (e.g., building access, parking info)"
                            value={field.state.value || ''}
                            onChangeText={(text) => field.handleChange(text)}
                            backgroundColor="$color4"
                            borderColor="$color5"
                            borderRadius="$4"
                            flex={1}
                            minHeight={100}
                          />
                        </YStack>
                      );
                    }}
                  />
                </>
              ) : (
                <form.AppField
                  name="location.url"
                  children={(field) => {
                    return (
                      <YStack gap="$2">
                        <Label htmlFor="url" fontSize="$3" fontWeight="500">
                          Event URL
                        </Label>
                        <Input
                          id="url"
                          keyboardType="url"
                          placeholder="Enter meeting URL (Zoom, Google Meet, etc.)"
                          value={field.state.value || ''}
                          onChangeText={(text) => field.handleChange(text)}
                          backgroundColor="$color4"
                          borderColor="$color5"
                          borderRadius="$4"
                        />
                        <SizableText fontSize="$2" color="$color10" mt="$1">
                          Share the link where attendees can join the online event
                        </SizableText>
                      </YStack>
                    );
                  }}
                />
              )}
            </YStack>

            {/* Action Buttons */}
            <XStack gap="$3" py="$4" backgroundColor="$color2">
              <Button flex={1} theme="red" onPress={handleCancel}>
                Cancel
              </Button>
              <Button flex={1} themeInverse onPress={handleSave}>
                Save Location
              </Button>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    );
  },
}) as typeof EventLocationSheet;
