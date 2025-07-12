import {
  H3,
  Card,
  Tabs,
  Text,
  View,
  YStack,
  Button,
  Image,
  Paragraph,
  XStack,
  Stack,
  H2,
  Anchor,
} from '@my/ui';
import { Award, Clock, MapPin, Users } from '@tamagui/lucide-icons';
import React, { useState } from 'react';

const Link = Anchor;

interface EventStats {
  mints?: number;
  capacity?: number | null;
  attendees?: number;
  poapsClaimed?: number;
}

interface Event {
  id: string;
  name: string;
  startTime: string;
  location: string;
  userRole: 'host' | 'attendee';
  nftTicketImageUrl?: string;
  poapImageUrl?: string | null;
  status?: string;
  stats?: EventStats;
}

export const MyEventsScreen = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [managedEventId, setManagedEventId] = React.useState<string | null>(null);

  const upcomingEvents: Event[] = [
    {
      id: 'evt-001',
      name: '_Test_',
      startTime: '2025-07-25T12:30:00Z',
      location: 'UPC - Campus San Miguel',
      userRole: 'host',
      nftTicketImageUrl: '/placeholder.svg',
      stats: { mints: 0, capacity: null },
    },
    {
      id: 'evt-002',
      name: 'Web3 Founders Meetup',
      startTime: '2025-07-28T18:00:00Z',
      location: 'Virtual',
      userRole: 'attendee',
      nftTicketImageUrl: '/placeholder.svg',
      stats: {},
    },
  ];

  const pastEvents: Event[] = [
    {
      id: 'evt-003',
      name: 'ROAST 02',
      startTime: '2025-06-09T08:00:00Z',
      location: 'Virtual',
      userRole: 'attendee',
      status: 'POAP_COLLECTED',
      poapImageUrl: '/placeholder.svg',
    },
    {
      id: 'evt-004',
      name: 'Trazabilidad digital Blockchain',
      startTime: '2025-06-04T18:30:00Z',
      location: 'Home for the Elderly Santa Cruz',
      userRole: 'attendee',
      status: 'MISSED',
      poapImageUrl: null,
    },
    {
      id: 'evt-005',
      name: 'My First Hosted Event',
      startTime: '2025-06-02T18:00:00Z',
      location: 'Lima, Peru',
      userRole: 'host',
      status: 'COMPLETED',
      poapImageUrl: '/placeholder.svg',
      stats: { attendees: 112, poapsClaimed: 105 },
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const groupEventsByDate = (events: Event[]) => {
    const grouped = events.reduce((acc, event) => {
      const dateKey = event.startTime.split('T')[0] ?? event.startTime;
      acc[dateKey] ??= [];
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, Event[]>);

    return Object.entries(grouped).sort(([a], [b]) =>
      activeTab === 'upcoming' ? a.localeCompare(b) : b.localeCompare(a)
    );
  };

  const EventCard = ({ event, isPast = false }: { event: Event; isPast?: boolean }) => {
    const imageUrl = isPast ? event.poapImageUrl : event.nftTicketImageUrl;
    const showDimmed = isPast && !event.poapImageUrl;

    return (
      <Card mb="$4" p="$6">
        <View display="flex" gap="$6">
          <View flex={1} gap="$4">
            <XStack display="flex" ai="center" gap="$3">
              <Clock size="$1" />
              <Text>{formatTime(event.startTime)}</Text>
            </XStack>

            <H3>{event.name}</H3>

            <XStack display="flex" ai="center" gap="$3">
              <MapPin size="$1" />
              <Text>{event.location}</Text>
            </XStack>

            {/* Status/Stats Row */}
            <View mb="$4">
              {event.userRole === 'host' && event.stats && (
                <View display="flex" gap="$3">
                  {isPast ? (
                    <>
                      {event.stats.attendees && (
                        <View display="flex" ai="center" gap="$1">
                          <Users size="$4" />
                          <Text>Attendees: {event.stats.attendees}</Text>
                        </View>
                      )}
                      {event.stats.poapsClaimed && (
                        <View display="flex" ai="center" gap="$1">
                          <Award size="$4" />
                          <Text>POAPs: {event.stats.poapsClaimed}</Text>
                        </View>
                      )}
                    </>
                  ) : (
                    <XStack display="flex" ai="center" gap="$3">
                      <Users size="$1" />
                      <Text>
                        Mints: {event.stats.mints ?? 0}
                        {event.stats.capacity ? ` / ${event.stats.capacity}` : ''}
                      </Text>
                    </XStack>
                  )}
                </View>
              )}

              {event.userRole === 'attendee' && isPast && (
                <View>
                  {event.status === 'POAP_COLLECTED' && <Text fontSize="$4">POAP Collected</Text>}
                  {event.status === 'MISSED' && <Text fontSize="$4">Event Missed</Text>}
                </View>
              )}
            </View>

            <Button
              size="$2"
              onPress={() => {
                if (event.userRole === 'host') {
                  setManagedEventId(event.id);
                }
              }}
            >
              {event.userRole === 'host' ? 'Manage Event' : 'View Ticket'}
            </Button>
          </View>

          {/* Visual */}
          <View
            bg="$accentColor"
            dsp="flex"
            h="$4"
            w="$4"
            ai="center"
            jc="center"
            ov="hidden"
            borderRadius="$4"
          >
            {imageUrl ? (
              <Image
                source={{
                  uri: imageUrl,
                  width: 100,
                  height: 100,
                }}
                width="100%"
                height="100%"
                objectFit="cover"
              />
            ) : (
              <View dsp="flex" h="100%" w="100%" ai="center" jc="center">
                {isPast ? <Award size="$5" /> : <Text fontSize="$2">NFT</Text>}
              </View>
            )}
          </View>
        </View>
      </Card>
    );
  };

  return (
    <YStack bg="$background" fullscreen>
      {/* <Navigation /> */}

      <View px="$4" py="$8">
        <View mb="$8">
          <H3 mb="$2">My Events</H3>
          <Text>Your digital experiences collection</Text>
        </View>

        <Tabs value={activeTab} onValueChange={setActiveTab} flexDirection="column">
          <Tabs.List mb="$8">
            <Tabs.Tab value="upcoming">
              <Text>Upcoming</Text>
            </Tabs.Tab>
            <Tabs.Tab value="past">
              <Text>Past</Text>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Content value="upcoming">
            {groupEventsByDate(upcomingEvents).map(([dateKey, events]) => (
              <View key={dateKey} pos="relative">
                <View pos="absolute" bottom={0} left={4} top={16} w="$0.25" bg="$borderColor" />

                <View mb="$9">
                  <View pos="relative" pl="$5">
                    <View
                      bg="$green10"
                      pos="absolute"
                      left={1}
                      top={3}
                      h="$0.75"
                      w="$0.75"
                      borderRadius="$5"
                    />
                    <View mb="$4">
                      <Paragraph fontSize="$4">{formatDate(events[0]?.startTime ?? '')}</Paragraph>
                      <Text fontSize="$2">{getDayOfWeek(events[0]?.startTime ?? '')}</Text>
                    </View>
                    {events.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </View>
                </View>
              </View>
            ))}

            {upcomingEvents.length === 0 && (
              <Text py="$12" ai="center">
                No upcoming events
              </Text>
            )}
          </Tabs.Content>

          <Tabs.Content value="past" className="space-y-0">
            {groupEventsByDate(pastEvents).map(([dateKey, events]) => (
              <View key={dateKey} pos="relative">
                <View pos="absolute" bottom={0} left={4} top={16} w="$0.25" bg="$black10" />

                <View mb="$9">
                  <View pos="relative" pl="$8">
                    <View
                      bg="$green10"
                      pos="absolute"
                      left={1}
                      top={3}
                      h="$0.75"
                      w="$0.75"
                      borderRadius="$5"
                    />
                    <View mb="$4">
                      <Text fontSize="$2">{formatDate(events[0]?.startTime ?? '')}</Text>
                      <Text fontSize="$2">{getDayOfWeek(events[0]?.startTime ?? '')}</Text>
                    </View>
                    {events.map((event) => (
                      <EventCard key={event.id} event={event} isPast />
                    ))}
                  </View>
                </View>
              </View>
            ))}

            {pastEvents.length === 0 && (
              <Text py="$12" ai="center">
                No past events
              </Text>
            )}
          </Tabs.Content>
        </Tabs>
      </View>
    </YStack>
  );
};
