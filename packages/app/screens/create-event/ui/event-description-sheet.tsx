import { useVisualViewportHeight } from '@my/ui';
import { useState } from 'react';
import { Sheet, Button, XStack, YStack, TextArea } from 'tamagui';

export interface EventDescriptionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
}

export function EventDescriptionSheet({
  open,
  onOpenChange,
  description,
  onDescriptionChange,
}: EventDescriptionSheetProps) {
  const [localDescription, setLocalDescription] = useState(description);
  const visualViewportHeight = useVisualViewportHeight();

  const handleSave = () => {
    onDescriptionChange(localDescription);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalDescription(description);
    onOpenChange(false);
  };

  // Reset local state when sheet opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalDescription(description);
    }
    onOpenChange(isOpen);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={handleOpenChange}
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
            <TextArea
              placeholder="Describe your event... What will attendees learn, experience, or participate in?"
              value={localDescription}
              onChangeText={setLocalDescription}
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
}
