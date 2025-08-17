import { Sheet, Button, XStack, YStack, useVisualViewportHeight } from '@my/ui';
import { ChevronDown } from '@tamagui/lucide-icons';
import { CreateEventScreen } from 'app/screens/create-event/create-event-screen';
import { memo, useCallback } from 'react';

interface CreateEventSheetWrapperProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateEventSheetWrapper({ open, setOpen }: CreateEventSheetWrapperProps) {
  const visualViewportHeight = useVisualViewportHeight();
  const closeSheet = useCallback(() => setOpen(false), [setOpen]);

  return (
    <Sheet
      dismissOnSnapToBottom
      forceRemoveScrollEnabled={open}
      modal
      open={open}
      onOpenChange={setOpen}
      zIndex={200_000}
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
        style={{ height: visualViewportHeight }}
        alignItems="center"
      >
        <YStack flex={1} width="100%">
          {/* Close Button */}
          <XStack
            position="absolute"
            top="$5"
            left="$5"
            zIndex={1000}
            alignItems="center"
            justifyContent="center"
          >
            <Button
              size="$3"
              circular
              chromeless
              borderWidth={1}
              backgroundColor="$background025"
              pressStyle={{
                backgroundColor: '$background05',
                borderColor: 'transparent',
              }}
              onPress={() => setOpen(false)}
              icon={<ChevronDown size={24} />}
            />
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
