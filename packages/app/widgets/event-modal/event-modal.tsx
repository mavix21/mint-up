import { useComposeCast } from '@coinbase/onchainkit/minikit';
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
  Avatar,
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
  Calendar,
  User,
  ExternalLink,
  MoreVertical,
  Sparkles,
} from '@tamagui/lucide-icons';
import { RegistersAvatar } from 'app/screens/explore-events/ui/RegistersAvatar';
import React, { Dispatch, SetStateAction } from 'react';

import TicketsEventSheet from './tickets-event-sheet';
import { ConvexEventWithExtras } from '../../entities/event.model';

export function EventModal({
  toggleEvent,
  setToggleEvent,
  eventData,
}: {
  toggleEvent: boolean;
  setToggleEvent: Dispatch<SetStateAction<boolean>>;
  eventData: ConvexEventWithExtras;
}) {
  const { composeCast } = useComposeCast();

  const [showTicketsSheet, setShowTicketsSheet] = React.useState(false);
  const visualViewportHeight = useVisualViewportHeight();
  const tickets = eventData.tickets;

  const allFree = tickets.every((ticket) => ticket.ticketType.type === 'offchain');

  const isOnline = eventData.location?.type === 'online';
  const isInPerson = eventData.location?.type === 'in-person';
  const hasLocation = typeof eventData.location === 'string' || isOnline || isInPerson;

  // Check if user is already registered
  const isUserRegistered = eventData.userStatus && eventData.userStatus !== 'rejected';
  const isUserHost = eventData.isHost;
  const canRegister = !isUserHost && !isUserRegistered;

  const getStatusChip = () => {
    if (isUserHost) {
      return (
        <Chip size="$2" theme="green">
          <Chip.Text>Hosting</Chip.Text>
        </Chip>
      );
    }

    if (eventData.userStatus) {
      const statusConfig = {
        pending: { label: 'Pending Approval', theme: 'yellow' as const },
        minted: { label: 'Ticket Minted', theme: 'green' as const },
        rejected: { label: 'Registration Rejected', theme: 'red' as const },
      };

      const config = statusConfig[eventData.userStatus as keyof typeof statusConfig];
      if (config) {
        return (
          <Chip size="$2" theme={config.theme}>
            <Chip.Text>{config.label}</Chip.Text>
          </Chip>
        );
      }
    }

    return null;
  };

  const getButtonText = () => {
    if (tickets.length === 0) return 'Join Waitlist';
    return allFree ? 'Register' : 'Buy Tickets';
  };

  const handleComposeWithEmbed = () => {
    try {
      composeCast({
        text: `🎉 ${eventData.name}

Join me at this amazing event! 

🗓️ ${formatDate(formatRelativeDate(eventData.startDate))}
📍 ${
          eventData.location?.type === 'online'
            ? 'Virtual Event'
            : eventData.location?.address || 'Location TBD'
        }

Check it out 👇`,
        embeds: [`https://mint-up-mini.vercel.app/events/${eventData._id}`],
      });
    } catch (error) {
      console.error('Failed to compose cast:', error);
    }
  };

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
          <YStack flex={1} width="100%" maxWidth={496} marginInline="auto">
            {/* Hero Section with Image */}
            <View position="relative" p="$4">
              <Image
                width="100%"
                maxWidth={496}
                aspectRatio={1}
                source={{ uri: eventData.imageUrl ?? '' }}
                objectFit="cover"
                borderRadius="$6"
                overflow="hidden"
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
              <YStack gap="$4" padding="$4" pt="$0">
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
                  {getStatusChip()}
                  {canRegister && (
                    <Chip size="$2" rounded>
                      <Chip.Text>
                        {tickets.length > 0 ? 'Tickets Available' : 'Waitlist Open'}
                      </Chip.Text>
                    </Chip>
                  )}
                </XStack>

                {/* Action Buttons - Only show if user is not host and not already registered */}
                {canRegister && (
                  <XStack gap="$3" justifyContent="space-between" alignItems="stretch">
                    <Button
                      flex={1}
                      fontWeight="600"
                      onPress={() => (tickets.length > 0 ? setShowTicketsSheet(true) : null)}
                      themeInverse
                    >
                      <Button.Text>{getButtonText()}</Button.Text>
                    </Button>

                    <Theme name="gray">
                      <Button size="$4" icon={<Share2 size={16} />}>
                        <Button.Text onPress={handleComposeWithEmbed}>Share</Button.Text>
                      </Button>
                    </Theme>

                    <Theme name="gray">
                      <Button height="100%" size="$2" icon={<MoreVertical size={16} />} />
                    </Theme>
                  </XStack>
                )}

                {/* Show only share and more buttons if user is host or already registered */}
                {(isUserHost || isUserRegistered) && (
                  <XStack gap="$3" justifyContent="flex-end" alignItems="stretch">
                    {isUserHost && (
                      <Theme name="gray">
                        <Button
                          flex={1}
                          fontWeight="600"
                          onPress={() => {
                            console.log('show ticket');
                          }}
                          iconAfter={ExternalLink}
                        >
                          <Button.Text>Manage</Button.Text>
                        </Button>
                      </Theme>
                    )}
                    {isUserRegistered && (
                      <Theme name="green">
                        <Button
                          flex={1}
                          fontWeight="600"
                          onPress={() => {
                            console.log('show ticket');
                          }}
                          iconAfter={<Sparkles />}
                        >
                          <Button.Text>You&apos;re in!</Button.Text>
                        </Button>
                      </Theme>
                    )}
                    <Theme name="gray">
                      <Button size="$4" icon={<Share2 size={16} />}>
                        <Button.Text onPress={handleComposeWithEmbed}>Share</Button.Text>
                      </Button>
                    </Theme>
                    <Theme name="gray">
                      <Button height="100%" size="$2" icon={<MoreVertical size={16} />} />
                    </Theme>
                  </XStack>
                )}

                {/* Location Section */}
                {hasLocation && (
                  <YStack gap="$3">
                    <YStack gap="$2">
                      <XStack alignItems="center" justifyContent="space-between">
                        <SizableText size="$4" fontWeight="600">
                          Location
                        </SizableText>
                      </XStack>
                      <Separator />
                    </YStack>
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
                    {/* {!isOnline && (
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
                    )} */}
                  </YStack>
                )}

                {/* Hosts Section */}
                <YStack gap="$3">
                  <YStack gap="$2">
                    <XStack alignItems="center" justifyContent="space-between">
                      <SizableText size="$4" fontWeight="600">
                        Hosts
                      </SizableText>
                    </XStack>
                    <Separator />
                  </YStack>
                  <YStack gap="$3">
                    {/* Placeholder Host - Replace with actual host data */}
                    <XStack alignItems="center" gap="$3">
                      {eventData.creator.imageUrl ? (
                        <Avatar circular size="$4">
                          <Avatar.Image source={{ uri: eventData.creator.imageUrl }} />
                          <Avatar.Fallback backgroundColor="$color8" />
                        </Avatar>
                      ) : (
                        <User size={16} color="$color" />
                      )}
                      <YStack flex={1}>
                        <SizableText size="$3" fontWeight="600">
                          {eventData.creator.name}
                        </SizableText>
                        {/* <SizableText color="$color8" size="$2" /> */}
                      </YStack>
                    </XStack>
                  </YStack>
                </YStack>

                {/* Attendees Section */}
                {eventData.registrationCount === 0 ? (
                  <YStack gap="$3">
                    <YStack gap="$2">
                      <SizableText size="$4" fontWeight="600">
                        Attendees
                      </SizableText>
                      <Separator />
                    </YStack>

                    <View>
                      <SizableText size="$1">Be the first to join this event.</SizableText>
                    </View>
                  </YStack>
                ) : (
                  <YStack gap="$3">
                    <YStack gap="$2">
                      <SizableText size="$4" fontWeight="600">
                        {eventData.registrationCount}{' '}
                        {eventData.registrationCount === 1 ? 'attendee' : 'attendees'}
                      </SizableText>
                      <Separator />
                    </YStack>
                    <View>
                      <RegistersAvatar event={eventData} />
                    </View>
                  </YStack>
                )}

                {/* About Event Section */}
                <YStack gap="$3">
                  <YStack gap="$2">
                    <SizableText size="$4" fontWeight="600">
                      About event
                    </SizableText>
                    <Separator />
                  </YStack>
                  <SizableText size="$3" lineHeight="$4">
                    {eventData.description || 'No description available for this event.'}
                  </SizableText>
                </YStack>
              </YStack>
            </ScrollView>

            {/* Bottom Action - Only show if user is not host and not already registered */}
            {canRegister && (
              <View padding="$4" borderTopWidth={1} borderColor="$borderColor">
                <Button
                  width="100%"
                  fontWeight="600"
                  themeInverse
                  onPress={() => (tickets.length > 0 ? setShowTicketsSheet(true) : null)}
                >
                  <Button.Text>{getButtonText()}</Button.Text>
                </Button>
              </View>
            )}
          </YStack>
        </Sheet.Frame>
      </Sheet>

      {tickets.length > 0 && canRegister ? (
        <TicketsEventSheet
          open={showTicketsSheet}
          onOpenChange={setShowTicketsSheet}
          eventId={eventData._id}
          ticketList={tickets}
        />
      ) : null}
    </>
  );
}
