import { View, H3, H2, H5, Text, Image } from '@my/ui';
import { X, ArrowRight, Clock, MapPin } from '@tamagui/lucide-icons';
import { Adapt, Button, Dialog, Sheet, Theme, ThemeName, Unspaced, XStack, YStack } from 'tamagui';

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
  const imageUrl = eventData.poapImageUrl ?? eventData.nftTicketImageUrl;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Dialog modal open={toggleEvent} onOpenChange={setToggleEvent}>
      <Adapt when="sm" platform="touch">
        <Sheet animation="medium" zIndex={200_000} modal dismissOnSnapToBottom>
          <Sheet.Frame gap="$3" backgroundColor="$color2" padding="$0">
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
          <Dialog.Title>
            <View>
              <Image height={200} source={{ uri: imageUrl ?? '' }} />
              <H3 mt="$3" px="$4">
                {eventData?.name}
              </H3>
            </View>
          </Dialog.Title>

          <Dialog.Description px="$4">
            <YStack>
              <XStack display="flex" gap="$2.5">
                <Clock size={15} mt="$1.5" color="$gray10" />
                <YStack>
                  <Text fontSize="$1" fontWeight="bold">
                    Wed 16, 2025
                  </Text>
                  <Text fontSize="$1" color="$gray11">
                    {formatTime(eventData.startTime)}
                  </Text>
                </YStack>
              </XStack>
              <XStack display="flex" gap="$2.5">
                <MapPin size={15} mt="$1.5" color="$gray10" />
                <YStack>
                  <Text fontSize="$1" fontWeight="bold">
                    {eventData.location}
                  </Text>
                  <Text fontSize="$1" color="$gray11">
                    San Miguel, Lima, Perú
                  </Text>
                </YStack>
              </XStack>
              <View mt="$3">
                <Text>About</Text>
                <Text mt="$3">{eventData?.description}</Text>
              </View>
            </YStack>
          </Dialog.Description>

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
