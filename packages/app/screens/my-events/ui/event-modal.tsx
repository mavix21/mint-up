import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { useQuery } from '@my/backend/react';
import { View, H3, Text, Image, ScrollView, useVisualViewportHeight } from '@my/ui';
import { formatDate, formatDateTime, formatRelativeDate } from '@my/ui/src/lib/dates';
import { Clock, MapPin, Globe } from '@tamagui/lucide-icons';
import React, { Dispatch, SetStateAction } from 'react';
import { Button, Paragraph, Sheet, XStack, YStack } from 'tamagui';

import { ConvexEventWithExtras } from '../my-events-screen';
import { TicketsEventSheet } from './tickets-event-sheet';

export function EventModal({
  toggleEvent,
  setToggleEvent,
  eventData,
}: {
  toggleEvent: boolean;
  setToggleEvent: Dispatch<SetStateAction<boolean>>;
  eventData: ConvexEventWithExtras;
}) {
  //const imageUrl = eventData.poapImageUrl ?? eventData.nftTicketImageUrl;
  const [showTicketsSheet, setShowTicketsSheet] = React.useState(false);
  const visualViewportHeight = useVisualViewportHeight();
  const ticketList = useQuery(api.ticketTemplates.getTicketsById, {
    eventId: eventData._id as Id<'events'>,
  });

  if (ticketList === undefined) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <Sheet
        dismissOnSnapToBottom
        forceRemoveScrollEnabled={toggleEvent}
        disableDrag
        modal
        open={toggleEvent}
        onOpenChange={setToggleEvent}
        snapPoints={[100]}
        snapPointsMode="percent"
        animation="medium"
        zIndex={200_000}
      >
        <Sheet.Overlay
          animation="lazy"
          backgroundColor="$shadowColor"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame
          key={visualViewportHeight}
          backgroundColor="$color2"
          padding="$0"
          style={{ height: visualViewportHeight }}
        >
          <YStack flex={1} width="100%">
            {/* Close Button */}
            <XStack
              position="absolute"
              top="$2"
              right="$2"
              alignItems="center"
              justifyContent="center"
              zIndex={1000}
            >
              <Button size="$2" circular borderWidth={1} onPress={() => setToggleEvent(false)}>
                ✕
              </Button>
            </XStack>

            {/* Event Content */}
            <YStack flex={1} pb="$4">
              <View>
                <Image height={300} source={{ uri: eventData.imageUrl ?? '' }} borderRadius="$3" />
                <H3 mt="$3" px="$4">
                  {eventData?.name}
                </H3>
              </View>

              <ScrollView flex={1} style={{ paddingHorizontal: 16 }}>
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
                        <MapPin size={15} mt="$1" color="$gray10" />
                        <YStack>
                          <Text fontSize="$1" fontWeight="bold">
                            {eventData.location}
                          </Text>
                        </YStack>
                      </XStack>
                    ) : eventData.location?.type === 'online' ? (
                      <XStack display="flex" gap="$2.5">
                        <Globe size={15} mt="$1" color="$gray10" />
                        <YStack>
                          <Text fontSize="$1" fontWeight="bold">
                            {eventData.location.url}
                          </Text>
                        </YStack>
                      </XStack>
                    ) : eventData.location?.type === 'in-person' ? (
                      <XStack display="flex" gap="$2.5">
                        <MapPin size={15} mt="$1" color="$gray10" />
                        <YStack>
                          <Text fontSize="$1" fontWeight="bold">
                            {eventData.location.address}
                          </Text>
                        </YStack>
                      </XStack>
                    ) : (
                      <Text>Unknown location</Text>
                    )}
                  </YStack>

                  <View mt="$3">
                    <Text fontWeight="bold">About</Text>
                    <Paragraph size="$4">{eventData.description}</Paragraph>
                  </View>
                </View>
              </ScrollView>

              <View padding="$4" borderTopWidth={1} borderColor="$color3" bg="$color2" width="100%">
                <Button width="100%" onPress={() => setShowTicketsSheet(true)}>
                  Buy tickets
                </Button>
              </View>
            </YStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>

      <TicketsEventSheet
        open={showTicketsSheet}
        onOpenChange={setShowTicketsSheet}
        eventId={eventData._id}
        ticketList={ticketList}
      />
    </>
  );
}
