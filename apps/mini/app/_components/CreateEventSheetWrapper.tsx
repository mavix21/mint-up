import { Sheet, Button, XStack, YStack, useVisualViewportHeight } from '@my/ui';
import { CreateEventScreen } from 'app/screens/create-event/create-event-screen';
import { memo, useCallback } from 'react';

interface CreateEventSheetWrapperProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateEventSheetWrapper({ open, setOpen }: CreateEventSheetWrapperProps) {
  console.log('CreateEventSheetWrapper');
  const visualViewportHeight = useVisualViewportHeight();
  const closeSheet = useCallback(() => setOpen(false), [setOpen]);

  return (
    <Sheet
      dismissOnSnapToBottom
      forceRemoveScrollEnabled={open}
      disableDrag
      modal
      open={open}
      onOpenChange={setOpen}
      zIndex={100_000}
      snapPoints={[100]}
      snapPointsMode="percent"
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="$shadowColor"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame
        key={visualViewportHeight}
        alignItems="center"
        style={{ height: visualViewportHeight }}
      >
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
            <Button size="$2" circular borderWidth={1} onPress={() => setOpen(false)}>
              ✕
            </Button>
          </XStack>

          <SheetContents closeSheet={closeSheet} />
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}

const SheetContents = memo(({ closeSheet }: { closeSheet: () => void }) => {
  return <CreateEventScreen closeSheet={closeSheet} />;
});
