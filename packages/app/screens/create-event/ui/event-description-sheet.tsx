import { useVisualViewportHeight } from '@my/ui';
import { withForm } from 'app/shared/lib/form';
import { useState, useRef } from 'react';
import { Sheet, Button, XStack, YStack, TextArea } from 'tamagui';

import { createEventFormOpts } from '../model/shared-form';

export interface EventDescriptionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EventDescriptionSheet = withForm({
  ...createEventFormOpts,
  props: {
    open: false,
    onOpenChange: () => {},
  } as EventDescriptionSheetProps,
  render: function EventDescriptionSheet({ open, onOpenChange, form }) {
    const visualViewportHeight = useVisualViewportHeight();
    const [initialDescription, setInitialDescription] = useState('');
    const hasInitialized = useRef(false);

    // Store initial state when sheet opens
    if (open && !hasInitialized.current) {
      const currentDescription = form.state.values.description || '';
      setInitialDescription(currentDescription);
      hasInitialized.current = true;
    }

    // Reset initial state when sheet closes
    if (!open && hasInitialized.current) {
      hasInitialized.current = false;
    }

    const handleSave = () => {
      onOpenChange(false);
    };

    const handleCancel = () => {
      // Restore initial state
      form.setFieldValue('description', initialDescription);
      onOpenChange(false);
    };

    return (
      <Sheet
        open={open}
        onOpenChange={onOpenChange}
        snapPoints={[100]}
        defaultPosition={0}
        modal
        disableDrag
        dismissOnOverlayPress={false}
        dismissOnSnapToBottom={false}
      >
        <Sheet.Overlay
          animation="lazy"
          backgroundColor="$shadowColor"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame
          py="$4"
          backgroundColor="$color2"
          key={visualViewportHeight}
          style={{ height: visualViewportHeight }}
        >
          <YStack flex={1} width="100%" maxWidth={496} marginHorizontal="auto">
            {/* TextArea - Takes up most of the space */}
            <YStack flex={1} px="$2">
              <form.AppField
                name="description"
                children={(field) => (
                  <TextArea
                    placeholder="Describe your event... What will attendees learn, experience, or participate in?"
                    value={field.state.value || ''}
                    onChangeText={field.handleChange}
                    backgroundColor="transparent"
                    borderWidth={0}
                    flex={1}
                    lineHeight="$5"
                    focusStyle={{
                      backgroundColor: 'transparent',
                      outlineColor: 'transparent',
                    }}
                    style={
                      {
                        fieldSizing: 'content',
                      } as any
                    }
                  />
                )}
              />
            </YStack>

            {/* Fixed Bottom Button */}
            <XStack
              gap="$3"
              px="$4"
              borderTopWidth={1}
              borderTopColor="$color4"
              backgroundColor="$color2"
            >
              <Button flex={1} theme="red" onPress={handleCancel}>
                Cancel
              </Button>
              <Button flex={1} themeInverse onPress={handleSave}>
                Save Description
              </Button>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    );
  },
}) as typeof EventDescriptionSheet;
