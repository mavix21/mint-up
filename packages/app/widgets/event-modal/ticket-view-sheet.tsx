import { Sheet, YStack, H4, View, RadioGroup, Button, useToastController } from '@my/ui';
import { memo } from 'react';

export interface TicketViewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TicketViewSheet = ({ open, onOpenChange }: TicketViewSheetProps) => {
  // Reset local state when sheet opens
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

  return (
    <Sheet
      open={open}
      forceRemoveScrollEnabled={open}
      onOpenChange={handleOpenChange}
      snapPoints={[90]}
      zIndex={200_000}
      modal
      dismissOnOverlayPress
      dismissOnSnapToBottom
      animation="lazy"
    >
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="$shadowColor"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame flex={1} width="100%" gap="$5">
        <Sheet.ScrollView>
          <YStack padding="$4" gap="$8" flex={1}>
            <H4>View your ticket</H4>
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

export default memo(TicketViewSheet);
