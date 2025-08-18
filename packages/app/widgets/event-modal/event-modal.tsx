import { useComposeCast } from '@coinbase/onchainkit/minikit';
import { api } from '@my/backend/_generated/api';
import { useMutation } from '@my/backend/react';
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
  LoadingButton,
  LiveIndicator,
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
} from '@tamagui/lucide-icons';
import { RegistersAvatar } from 'app/screens/explore-events/ui/RegistersAvatar';
import { useSignIn } from 'app/shared/lib/hooks/use-sign-in';
import { isEventLive } from 'app/shared/lib/utils';
import React, { Dispatch, SetStateAction } from 'react';
import { usePathname, useRouter } from 'solito/navigation';

import { EventSettingsDropdown } from './EventSettingsDropdown';
import TicketViewSheet from './ticket-view-sheet';
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
  const { signIn, session, isLoading: signInLoading, isSignedIn } = useSignIn();

  // Check if event is currently live using the shared utility
  const eventIsLive = isEventLive(eventData.startDate, eventData.endDate);
  const { composeCast } = useComposeCast();
  const deleteRegistration = useMutation(api.registrations.deleteRegistration);
  const router = useRouter();
  const pathname = usePathname();

  const [showTicketsSheet, setShowTicketsSheet] = React.useState(false);
  const [showTicketViewSheet, setShowTicketViewSheet] = React.useState(false);
  const [triggerOpen, setTriggerOpen] = React.useState(false);
  const visualViewportHeight = useVisualViewportHeight();
  const tickets = eventData.tickets;

  const allFree = tickets.every((ticket) => ticket.ticketType.type === 'offchain');

  const isOnline = eventData.location?.type === 'online';
  const isInPerson = eventData.location?.type === 'in-person';
  const hasLocation = typeof eventData.location === 'string' || isOnline || isInPerson;

  // Check if user is already registered
  const isUserRegistered =
    eventData.userStatus !== null &&
    eventData.userStatus !== undefined &&
    eventData.userStatus !== 'rejected';
  const isUserHost = eventData.isHost;
  const canRegister = isSignedIn && !isUserHost && !isUserRegistered;
  const needsSignIn = !isSignedIn;
  const canCancelRegistration =
    isSignedIn && isUserRegistered && eventData && eventData.userStatus !== 'minted';
  const canViewTicket = !!session && isUserRegistered && eventData.userStatus !== 'rejected';

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

  const handleCancelRegistration = async () => {
    await deleteRegistration({
      eventId: eventData._id,
    });
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

              {/* Live Indicator */}
              {eventIsLive && (
                <View position="absolute" top="$7" right="$7" zIndex={2}>
                  <LiveIndicator size="medium" />
                </View>
              )}

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
                  backgroundColor="$background075"
                  pressStyle={{
                    backgroundColor: '$background',
                    borderColor: 'transparent',
                  }}
                  onPress={() => {
                    if (pathname?.includes('events/')) {
                      setToggleEvent(false);
                      router.push('/');
                    } else {
                      setToggleEvent(false);
                    }
                  }}
                  icon={<ChevronDown size={24} />}
                />
              </XStack>
            </View>

            {/* Event Content */}
            <ScrollView flex={1} bounces={false}>
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
                {(getStatusChip() || canRegister) && (
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
                )}

                {isUserRegistered && (
                  <Theme name="green">
                    <SizableText fontWeight="600">You&apos;re in! ✨</SizableText>
                  </Theme>
                )}

                {/* Action Buttons - Only show if user is not host and not already registered */}
                {(canRegister || needsSignIn) && (
                  <XStack gap="$3" justifyContent="space-between" alignItems="stretch">
                    {needsSignIn ? (
                      <LoadingButton
                        flex={1}
                        label="Sign In to Register"
                        isLoading={signInLoading}
                        onPress={signIn}
                        themeInverse
                      />
                    ) : (
                      <Button
                        flex={1}
                        fontWeight="600"
                        onPress={() => (tickets.length > 0 ? setShowTicketsSheet(true) : null)}
                        themeInverse
                      >
                        <Button.Text>{getButtonText()}</Button.Text>
                      </Button>
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
                    {/* {canCancelRegistration && (
                      <Theme name="red">
                        <Button flex={1} fontWeight="600" onPress={handleCancelRegistration}>
                          <Button.Text>Cancel Registration</Button.Text>
                        </Button>
                      </Theme>
                    )} */}
                    {canViewTicket && (
                      <Theme name="orange">
                        <Button
                          flex={1}
                          fontWeight="600"
                          onPress={() => setShowTicketViewSheet(true)}
                        >
                          <Button.Text>View Ticket</Button.Text>
                        </Button>
                      </Theme>
                    )}
                    <Theme name="gray">
                      <Button size="$4" icon={<Share2 size={16} />}>
                        <Button.Text onPress={handleComposeWithEmbed}>Share</Button.Text>
                      </Button>
                    </Theme>
                    <Theme name="gray">
                      {/* <Button height="100%" size="$2" icon={<MoreVertical size={16} />} /> */}
                      <EventSettingsDropdown
                        triggerOpen={triggerOpen}
                        setTriggerOpen={setTriggerOpen}
                        canCancelRegistration={canCancelRegistration}
                        onCancelRegistration={handleCancelRegistration}
                      />
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
                    {/* Host information - Show user not found indication if needed */}
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
                        {eventData.creator.name ? (
                          <SizableText size="$3" fontWeight="600">
                            {eventData.creator.name}
                          </SizableText>
                        ) : (
                          <YStack gap="$1">
                            <SizableText size="$3" fontWeight="600" color="$color11">
                              User Not Found
                            </SizableText>
                            <SizableText size="$2" color="$color10">
                              This user&apos;s profile is no longer available
                            </SizableText>
                          </YStack>
                        )}
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
                      {isUserHost ? (
                        <SizableText size="$1">
                          Your event is live – start inviting attendees today.
                        </SizableText>
                      ) : (
                        <SizableText size="$1">Be the first to join this event.</SizableText>
                      )}
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
            {(canRegister || needsSignIn) && (
              <View padding="$4" borderTopWidth={1} borderColor="$borderColor">
                {needsSignIn ? (
                  <LoadingButton
                    width="100%"
                    label="Sign In to Register"
                    isLoading={signInLoading}
                    onPress={signIn}
                    themeInverse
                  />
                ) : (
                  <Button
                    width="100%"
                    fontWeight="600"
                    themeInverse
                    onPress={() => (tickets.length > 0 ? setShowTicketsSheet(true) : null)}
                  >
                    <Button.Text>{getButtonText()}</Button.Text>
                  </Button>
                )}
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
      {canViewTicket ? (
        <TicketViewSheet
          open={showTicketViewSheet}
          onOpenChange={setShowTicketViewSheet}
          eventId={eventData._id}
          userId={session.user.id}
        />
      ) : null}
    </>
  );
}
