import { View, H3, Text, Image, ScrollView, useVisualViewportHeight } from '@my/ui';
import { formatDate, formatDateTime, formatRelativeDate } from '@my/ui/src/lib/dates';
import { X, Clock, MapPin } from '@tamagui/lucide-icons';
import React from 'react';
import { Adapt, Button, Dialog, Paragraph, Sheet, Unspaced, XStack, YStack } from 'tamagui';

import { ConvexEventWithExtras } from '../my-events-screen';
import { TicketsEventSheet } from './tickets-event-sheet';

export function EventModal({
  toggleEvent,
  setToggleEvent,
  eventData,
}: {
  toggleEvent: boolean;
  setToggleEvent: (e: boolean) => void;
  eventData: ConvexEventWithExtras;
}) {
  //const imageUrl = eventData.poapImageUrl ?? eventData.nftTicketImageUrl;
  const [showTicketsSheet, setShowTicketsSheet] = React.useState(false);
  const visualViewportHeight = useVisualViewportHeight();

  return (
    <Dialog modal open={toggleEvent} onOpenChange={setToggleEvent}>
      <Adapt when="sm" platform="touch">
        <Sheet
          dismissOnSnapToBottom
          disableDrag
          modal
          zIndex={200_000}
          snapPoints={[100]}
          animation="medium"
        >
          <Sheet.Overlay
            animation="lazy"
            backgroundColor="$shadowColor"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Sheet.Handle backgroundColor="$color2" />
          <Sheet.Frame
            gap="$3"
            backgroundColor="$color2"
            padding="$0"
            style={{ height: visualViewportHeight }}
          >
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
          gap="$0" // Remove gap between scroll and button
          padding="$0"
        >
          <YStack flex={1} pb="$4">
            <Dialog.Title>
              <View>
                <Image height={300} source={{ uri: eventData.imageUrl ?? '' }} borderRadius="$3" />
                <H3 mt="$3" px="$4">
                  {eventData?.name}
                </H3>
              </View>
            </Dialog.Title>

            <ScrollView flex={1} style={{ paddingHorizontal: 16 }}>
              <Dialog.Description asChild px="$0">
                <View>
                  <YStack mt="$3">
                    <XStack display="flex" gap="$2.5">
                      <Clock size={15} mt="$1.5" color="$gray10" />
                      <YStack>
                        <Paragraph fontSize="$1" fontWeight="bold">
                          {formatDate(formatRelativeDate(eventData.startDate))}
                        </Paragraph>
                        <Paragraph fontSize="$1" color="$gray11">
                          {formatDateTime(formatRelativeDate(eventData.startDate))}
                        </Paragraph>
                      </YStack>
                    </XStack>
                    {typeof eventData.location === 'string' ? (
                      <XStack display="flex" gap="$2.5">
                        <MapPin size={15} mt="$1.5" color="$gray10" />
                        <YStack>
                          <Text fontSize="$1" fontWeight="bold">
                            {eventData.location}
                          </Text>
                          {/* <Text fontSize="$1" color="$gray11">
                          San Miguel, Lima, Perú
                        </Text> */}
                        </YStack>
                      </XStack>
                    ) : eventData.location?.type === 'online' ? (
                      <XStack display="flex" gap="$2.5">
                        <MapPin size={15} mt="$1.5" color="$gray10" />
                        <YStack>
                          <Text fontSize="$1" fontWeight="bold">
                            {eventData.location.url}
                          </Text>
                          {/* <Text fontSize="$1" color="$gray11">
                          San Miguel, Lima, Perú
                        </Text> */}
                        </YStack>
                      </XStack>
                    ) : eventData.location?.type === 'in-person' ? (
                      <XStack display="flex" gap="$2.5">
                        <MapPin size={15} mt="$1.5" color="$gray10" />
                        <YStack>
                          <Text fontSize="$1" fontWeight="bold">
                            {eventData.location.address}
                          </Text>
                          {/* <Text fontSize="$1" color="$gray11">
                          San Miguel, Lima, Perú
                        </Text> */}
                        </YStack>
                      </XStack>
                    ) : (
                      <Text>Unknown location</Text>
                    )}
                  </YStack>
                  <View mt="$3">
                    <Text fontWeight="bold">About</Text>
                    {/* <Text mt="$2">{eventData?.description}</Text> */}
                    <Paragraph size="$4">{eventData.description}</Paragraph>
                  </View>
                </View>
              </Dialog.Description>
            </ScrollView>

            <TicketsEventSheet
              key={eventData._id}
              open={showTicketsSheet}
              onOpenChange={setShowTicketsSheet}
              eventId={eventData._id}
            />
            <View padding="$4" borderTopWidth={1} borderColor="$color3" bg="$color2">
              <Button theme="green" width="100%" onPress={() => setShowTicketsSheet(true)}>
                Buy tickets
              </Button>
            </View>
          </YStack>

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
