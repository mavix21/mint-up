import { Doc } from '@my/backend/_generated/dataModel';
import { Sheet, Button, XStack, YStack, useVisualViewportHeight, ScrollView } from '@my/ui';
import { ChevronDown } from '@tamagui/lucide-icons';
import { UpdateEventForm } from 'app/screens/manage-event/ui';
import { memo, useCallback } from 'react';

interface UpdateEventSheetWrapperProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  event: Doc<'events'>;
}

export function UpdateEventSheetWrapper({ open, setOpen, event }: UpdateEventSheetWrapperProps) {
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
        alignItems="flex-start"
      >
        <YStack flex={1} width="100%" overflowBlock="auto">
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
              backgroundColor="$background075"
              pressStyle={{ backgroundColor: '$background', borderColor: 'transparent' }}
              onPress={() => setOpen(false)}
              icon={<ChevronDown size={24} />}
            />
          </XStack>
          <SheetContents event={event} closeSheet={closeSheet} />
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}

const SheetContents = memo(
  ({ event, closeSheet }: { event: Doc<'events'>; closeSheet: () => void }) => {
    return (
      <YStack flex={1} fullscreen overflowBlock="auto">
        <ScrollView overflowBlock="auto" flex={1} width="100%">
          <YStack gap="$4" px="$4" py="$4" marginHorizontal="auto" width="100%" maxWidth={496}>
            <UpdateEventForm event={event} onSubmit={async () => true} onThemeChange={() => {}} />
          </YStack>
        </ScrollView>
      </YStack>
    );
  }
);
