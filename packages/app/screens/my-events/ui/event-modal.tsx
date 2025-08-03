import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { useQuery } from '@my/backend/react';
import {
  View,
  SizableText,
  Image,
  ScrollView,
  useVisualViewportHeight,
  Button,
  Sheet,
  XStack,
  YStack,
  H4,
  Avatar,
  Card,
  H1,
  H2,
  Chip,
  Theme,
  Separator,
} from '@my/ui';
import { formatDate, formatDateTime, formatRelativeDate } from '@my/ui/src/lib/dates';
import {
  Clock,
  MapPin,
  Globe,
  ChevronDown,
  Share2,
  MessageCircle,
  MoreHorizontal,
  Calendar,
  User,
  ExternalLink,
  MoreVertical,
} from '@tamagui/lucide-icons';
import React, { Dispatch, SetStateAction } from 'react';

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
  const [showTicketsSheet, setShowTicketsSheet] = React.useState(false);
  const visualViewportHeight = useVisualViewportHeight();
  const ticketList = useQuery(api.ticketTemplates.getTicketsById, {
    eventId: eventData._id as Id<'events'>,
  });

  if (ticketList === undefined) {
    return (
      <Sheet open={false}>
        <SizableText>Loading event-modal</SizableText>;
      </Sheet>
    );
  }

  const isOnline = eventData.location?.type === 'online';
  const isInPerson = eventData.location?.type === 'in-person';
  const hasLocation = typeof eventData.location === 'string' || isOnline || isInPerson;

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
          borderRadius="$0"
          style={{ height: visualViewportHeight }}
        >
          <YStack flex={1} width="100%">
            {/* Hero Section with Image */}
            <View position="relative">
              <Image
                height={300}
                width="100%"
                source={{ uri: eventData.imageUrl ?? '' }}
                objectFit="cover"
              />

              {/* Close Button */}
              <Button
                position="absolute"
                top="$3"
                left="$3"
                circular
                chromeless
                borderWidth={1}
                backgroundColor="$background025"
                pressStyle={{
                  backgroundColor: '$background05',
                  borderColor: 'transparent',
                }}
                onPress={() => setToggleEvent(false)}
                icon={<ChevronDown size={20} />}
              />
            </View>

            {/* Event Content */}
            <ScrollView flex={1} showsVerticalScrollIndicator={false}>
              <YStack padding="$4" gap="$4">
                {/* Event Header */}
                <YStack gap="$2">
                  <H2 fontWeight="bold" color="$color">
                    {eventData?.name}
                  </H2>

                  <XStack alignItems="center" gap="$2">
                    <Calendar size={16} opacity={0.8} />
                    <SizableText size="$2" opacity={0.8}>
                      {formatDate(formatRelativeDate(eventData.startDate))}
                    </SizableText>
                  </XStack>

                  <XStack alignItems="center" gap="$2">
                    <Clock size={16} opacity={0.8} />
                    <SizableText size="$2" opacity={0.8}>
                      {formatDateTime(formatRelativeDate(eventData.startDate))}
                    </SizableText>
                  </XStack>
                </YStack>

                {/* Status Badge */}
                <XStack alignItems="center" gap="$2">
                  <Chip size="$2" rounded>
                    <Chip.Text>
                      {ticketList.length > 0 ? 'Tickets Available' : 'Waitlist Open'}
                    </Chip.Text>
                  </Chip>
                </XStack>

                {/* Action Buttons */}
                <XStack gap="$3" justifyContent="space-between" alignItems="stretch">
                  <Button
                    flex={1}
                    fontWeight="600"
                    onPress={() => (ticketList.length > 0 ? setShowTicketsSheet(true) : null)}
                  >
                    <Button.Text>
                      {ticketList.length > 0 ? 'Buy Tickets' : 'Join Waitlist'}
                    </Button.Text>
                  </Button>

                  <Theme name="gray">
                    <Button size="$4" icon={<Share2 size={16} />}>
                      <Button.Text>Share</Button.Text>
                    </Button>
                  </Theme>

                  <Theme name="gray">
                    <Button height="100%" size="$2" icon={<MoreVertical size={16} />} />
                  </Theme>
                </XStack>

                {/* Location Section */}
                {hasLocation && (
                  <YStack gap="$3">
                    <XStack alignItems="center" justifyContent="space-between">
                      <H4 size="$4" fontWeight="600">
                        Location
                      </H4>
                      <Button size="$2" backgroundColor="transparent">
                        <Button.Text>Contact</Button.Text>
                      </Button>
                    </XStack>

                    <Separator />

                    <XStack alignItems="flex-start" gap="$3">
                      {isOnline ? (
                        <Globe size={18} marginTop="$0.5" />
                      ) : (
                        <MapPin size={18} marginTop="$0.5" />
                      )}
                      <YStack flex={1} gap="$1">
                        {isOnline ? (
                          <>
                            <SizableText size="$3" fontWeight="600">
                              {eventData.location &&
                              typeof eventData.location === 'object' &&
                              'url' in eventData.location
                                ? eventData.location.url
                                : 'Link TBD'}
                            </SizableText>
                            <SizableText size="$2">Online Event</SizableText>
                          </>
                        ) : (
                          <>
                            <SizableText size="$4" fontWeight="600">
                              {typeof eventData.location === 'string'
                                ? eventData.location
                                : eventData.location &&
                                  typeof eventData.location === 'object' &&
                                  'address' in eventData.location
                                ? eventData.location.address
                                : 'Location TBD'}
                            </SizableText>
                            <SizableText size="$1">
                              {typeof eventData.location === 'string'
                                ? 'In-person Event'
                                : eventData.location &&
                                  typeof eventData.location === 'object' &&
                                  'city' in eventData.location &&
                                  'country' in eventData.location
                                ? `${eventData.location.city}, ${eventData.location.country}`
                                : 'In-person Event'}
                            </SizableText>
                          </>
                        )}
                      </YStack>
                      {isOnline && (
                        <Button
                          size="$2"
                          backgroundColor="transparent"
                          icon={<ExternalLink size={14} />}
                        />
                      )}
                    </XStack>

                    {/* Map Placeholder for In-person Events */}
                    {!isOnline && (
                      <View
                        height={120}
                        backgroundColor="$color5"
                        borderRadius="$2"
                        alignItems="center"
                        justifyContent="center"
                        marginTop="$2"
                      >
                        <SizableText size="$2" color="$color11">
                          Map View
                        </SizableText>
                      </View>
                    )}
                  </YStack>
                )}

                {/* Hosts Section */}
                <YStack gap="$3">
                  <XStack alignItems="center" justifyContent="space-between">
                    <H4 size="$4" fontWeight="600">
                      Hosts
                    </H4>
                    <Button size="$2" backgroundColor="transparent">
                      <Button.Text>Contact</Button.Text>
                    </Button>
                  </XStack>

                  <YStack gap="$3">
                    {/* Placeholder Host - Replace with actual host data */}
                    <XStack alignItems="center" gap="$3">
                      <Avatar circular size="$4" backgroundColor="$color8">
                        <User size={16} color="$color" />
                      </Avatar>
                      <YStack flex={1}>
                        <SizableText size="$3" fontWeight="600">
                          Event Organizer
                        </SizableText>
                        <SizableText color="$color8" size="$2">
                          Event Host
                        </SizableText>
                      </YStack>
                    </XStack>
                  </YStack>
                </YStack>

                {/* About Event Section */}
                <YStack gap="$3">
                  <SizableText size="$4" fontWeight="600">
                    About Event
                  </SizableText>
                  <Separator />
                  <SizableText size="$3" lineHeight="$4">
                    {eventData.description || 'No description available for this event.'}
                  </SizableText>
                </YStack>
              </YStack>
            </ScrollView>

            {/* Bottom Action */}
            <View
              padding="$4"
              borderTopWidth={1}
              borderColor="$borderColor"
              backgroundColor="$background"
            >
              <Button
                width="100%"
                fontWeight="600"
                onPress={() => (ticketList.length > 0 ? setShowTicketsSheet(true) : null)}
              >
                <Button.Text>{ticketList.length > 0 ? 'Buy Tickets' : 'Join Waitlist'}</Button.Text>
              </Button>
            </View>
          </YStack>
        </Sheet.Frame>
      </Sheet>

      {ticketList.length > 0 ? (
        <TicketsEventSheet
          open={showTicketsSheet}
          onOpenChange={setShowTicketsSheet}
          eventId={eventData._id}
          ticketList={ticketList}
        />
      ) : null}
    </>
  );
}
