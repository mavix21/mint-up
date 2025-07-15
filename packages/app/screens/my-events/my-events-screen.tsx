import { H3, Tabs, Text, View, YStack, Theme, Sheet } from '@my/ui';
import React from 'react';

import type { Event } from './model/Event';
import { EventCard } from './ui/event-card';

const upcomingEvents: Event[] = [
  {
    id: 'evt-001',
    name: '_Test_',
    startTime: '2025-07-25T12:30:00Z',
    location: 'UPC - Campus San Miguel',
    userRole: 'host',
    nftTicketImageUrl:
      'https://img.freepik.com/foto-gratis/amigos-felices-tiro-medio-bebidas_23-2149481210.jpg?t=st=1752373680~exp=1752377280~hmac=ace42efe105abfcfe521907355f9c2de530d2ee3863027e943f58bb1f3eac887&w=360',
    stats: { mints: 0, capacity: null },
  },
  {
    id: 'evt-002',
    name: 'Web3 Founders Meetup',
    startTime: '2025-07-28T18:00:00Z',
    location: 'Virtual',
    userRole: 'attendee',
    nftTicketImageUrl:
      'https://img.freepik.com/foto-gratis/familia-tiro-completo-celebrando-4-julio_23-2149383081.jpg?t=st=1752373560~exp=1752377160~hmac=0fa153a9d0dd5604ee8cc4ba5580a4999c3a809c9459bfcdd2603ecb8b115730&w=740',
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
    poapImageUrl: 'https://tamagui.dev/bento/images/bag/bag3.webp',
  },
  {
    id: 'evt-004',
    name: 'Blockchain',
    startTime: '2025-06-04T18:30:00Z',
    location: 'Home',
    userRole: 'attendee',
    status: 'MISSED',
    poapImageUrl:
      'https://img.freepik.com/foto-gratis/amigos-felices-tiro-medio-bebidas_23-2149481210.jpg?t=st=1752373680~exp=1752377280~hmac=ace42efe105abfcfe521907355f9c2de530d2ee3863027e943f58bb1f3eac887&w=360',
  },
  {
    id: 'evt-005',
    name: 'My First Hosted Event',
    startTime: '2025-06-02T18:00:00Z',
    location: 'Lima, Peru',
    userRole: 'host',
    status: 'COMPLETED',
    poapImageUrl:
      'https://img.freepik.com/foto-gratis/familia-tiro-completo-celebrando-4-julio_23-2149383081.jpg?t=st=1752373560~exp=1752377160~hmac=0fa153a9d0dd5604ee8cc4ba5580a4999c3a809c9459bfcdd2603ecb8b115730&w=740',
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

const getDayOfWeek = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const groupEventsByDate = (events: Event[], activeTab: string) => {
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

export const MyEventsScreen = () => {
  const [activeTab, setActiveTab] = React.useState('upcoming');
  const [, setId] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState(0);

  return (
    <>
      <YStack flex={1} fullscreen maxWidth={600} marginInline="auto" overflowBlock="hidden">
        {/* <Navigation /> */}

        <View px="$4" py="$8" height="100%" overflowBlock="hidden">
          <View mb="$5">
            <H3 mb="$2">My Events</H3>
            <Text>Your digital experiences collection</Text>
          </View>
          <Theme name="green_surface1">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              flexDirection="column"
              overflowBlock="hidden"
              height="100%"
            >
              <Tabs.List mb="$6">
                <Tabs.Tab value="upcoming" $xs={{ width: '50%' }}>
                  <Text>Upcoming</Text>
                </Tabs.Tab>
                <Tabs.Tab value="past" $xs={{ width: '50%' }}>
                  <Text>Past</Text>
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Content
                value="upcoming"
                overflowBlock="scroll"
                height="100%"
                paddingInlineEnd="$4"
                paddingBottom={160}
              >
                {groupEventsByDate(upcomingEvents, activeTab).map(([dateKey, events], index) => (
                  <View key={dateKey} pos="relative">
                    <View pos="absolute" bottom={0} left={4} top={16} w="$0.25" bg="$gray6" />

                    <View mb="$9">
                      <View pos="relative" pl="$6">
                        <View
                          theme="green"
                          bg="$color8"
                          pos="absolute"
                          left={1}
                          top={3}
                          h="$0.75"
                          w="$0.75"
                          borderRadius="$5"
                        />
                        <View mb="$4">
                          <Text fontSize="$2" color="$color11">
                            {formatDate(events[0]?.startTime ?? '')}
                          </Text>
                          <Text fontSize="$2">{getDayOfWeek(events[0]?.startTime ?? '')}</Text>
                        </View>
                        {events.map((event) => (
                          <EventCard key={event.id} event={event} isPast index={index} />
                        ))}
                      </View>
                    </View>
                  </View>
                ))}
              </Tabs.Content>

              <Tabs.Content
                value="past"
                className="space-y-0"
                overflowBlock="scroll"
                height="100%"
                paddingInlineEnd="$4"
                paddingBottom={160}
              >
                {groupEventsByDate(pastEvents, activeTab).map(([dateKey, events], index) => (
                  <View key={dateKey} pos="relative">
                    <View pos="absolute" bottom={0} left={4} top={16} w="$0.25" bg="$gray6" />

                    <View mb="$9">
                      <View pos="relative" pl="$6">
                        <View
                          bg="$color8"
                          pos="absolute"
                          theme="green"
                          left={1}
                          top={3}
                          h="$0.75"
                          w="$0.75"
                          borderRadius="$5"
                        />
                        <View mb="$4">
                          <Text fontSize="$2" color="$color11">
                            {formatDate(events[0]?.startTime ?? '')}
                          </Text>
                          <Text fontSize="$2">{getDayOfWeek(events[0]?.startTime ?? '')}</Text>
                        </View>
                        {events.map((event) => (
                          <EventCard key={event.id} event={event} isPast index={index} />
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
          </Theme>
        </View>
      </YStack>
      <Sheet
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        open={open}
        onOpenChange={setOpen}
        modal
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame>{/* ...inner contents */}</Sheet.Frame>
      </Sheet>
    </>
  );
};
