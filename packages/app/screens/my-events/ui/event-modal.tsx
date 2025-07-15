import { X } from '@tamagui/lucide-icons';
import { Adapt, Button, Dialog, Sheet, Theme, ThemeName, Unspaced, XStack } from 'tamagui';

import { Event } from '../model/Event';

export function EventModal({
  toggleEvent,
  setToggleEvent,
  eventData,
}: {
  toggleEvent: boolean;
  setToggleEvent: (e: boolean) => void;
  eventData: Event;
}) {
  return (
    <Dialog modal open={toggleEvent} onOpenChange={setToggleEvent}>
      <Adapt when="sm" platform="touch">
        <Sheet animation="medium" zIndex={200_000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>

          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Sheet>
      </Adapt>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          o={0.5}
          enterStyle={{ o: 0 }}
          exitStyle={{ o: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, o: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, o: 0, scale: 0.95 }}
          minWidth={650}
          gap="$4"
        >
          <Dialog.Title>{eventData?.name}</Dialog.Title>

          <Dialog.Description>{eventData?.description}</Dialog.Description>

          {/* <XStack gap="$1">
            {eventData.tags.map((tag) => (
              <Theme key={tag.text} name={tag.theme as ThemeName}>
                <Button size="$1" px="$2" br="$10" disabled>
                  {tag.text}
                </Button>
              </Theme>
            ))}
          </XStack> */}

          <Unspaced>
            <Dialog.Close asChild>
              <Button pos="absolute" t="$3" r="$3" size="$2" circular icon={X} />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
