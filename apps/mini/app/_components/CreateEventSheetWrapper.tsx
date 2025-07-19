import { Sheet, Button, XStack, YStack } from '@my/ui';
import { CreateEventScreen } from 'app/screens/create-event/create-event-screen';
import { memo } from 'react';

interface CreateEventSheetWrapperProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateEventSheetWrapper({ open, setOpen }: CreateEventSheetWrapperProps) {
  return (
    <Sheet
      dismissOnSnapToBottom
      disableDrag
      forceRemoveScrollEnabled={open}
      modal
      open={open}
      onOpenChange={setOpen}
      zIndex={100_000}
      snapPoints={[96]}
      snapPointsMode="percent"
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="$shadowColor"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle backgroundColor="$color2" />
      <Sheet.Frame alignItems="center" bg="$color2">
        <SheetContents onClose={() => setOpen(false)} />
      </Sheet.Frame>
    </Sheet>
  );
}

const SheetContents = memo(({ onClose }: { onClose: () => void }) => {
  return (
    <YStack flex={1} width="100%">
      {/* Close Button */}
      <XStack
        position="absolute"
        top="$2"
        right="$2"
        zIndex={1000}
        alignItems="center"
        justifyContent="center"
      >
        <Button
          size="$2"
          circular
          backgroundColor="$color4"
          borderColor="$color6"
          borderWidth={1}
          onPress={onClose}
          pressStyle={{ backgroundColor: '$color5' }}
        >
          ✕
        </Button>
      </XStack>

      <CreateEventScreen />
    </YStack>
  );
});
