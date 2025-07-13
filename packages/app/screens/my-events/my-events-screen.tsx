import React from 'react';
import { Clock, MapPin } from '@tamagui/lucide-icons';
import {
  H3,
  Tabs,
  Text,
  View,
  YStack,
  Button,
  Image,
  XStack,
  useMedia,
  Theme,
  Sheet,
} from '@my/ui';
import { MyEventScreen } from '../my-event/my-event-screen';

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
  const [activeTab, setActiveTab] = React.useState('upcoming');
  const [managedEventId, setManagedEventId] = React.useState<string | null>(null);

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

  const EventCard = ({
    event,
    isPast = false,
    index = 0,
  }: {
    event: Event;
    isPast?: boolean;
    index: number;
  }) => {
    const imageUrl = isPast ? event.poapImageUrl : event.nftTicketImageUrl;
    const showDimmed = isPast && !event.poapImageUrl;
    console.log(index);
    return (
      <>
        <YStack
          flexDirection="row"
          flexWrap="wrap"
          gap="$6"
          $sm={{
            gap: '$4',
          }}
          onLayout={onLayout}
          elevation="$2"
          borderRadius="$5"
        >
          <View
            flexGrow={sm ? 1 : 0}
            flexBasis={125}
            gap="$4"
            flexDirection="column"
            borderRadius="$4"
          >
            <Image
              borderRadius={10}
              backgroundColor="$color1"
              objectFit="cover"
              height={150}
              $platform-native={{
                minWidth: layoutWidth,
              }}
              $group-window-gtMd={{
                minWidth: 'inherit',
              }}
              source={{ uri: imageUrl ?? '' }}
            />
          </View>

          <View
            flex={1}
            flexBasis={240}
            justifyContent="center"
            gap="$2"
            $xs={{
              px: '$4',
            }}
          >
            <View
              flexDirection="row"
              alignItems="center"
              gap="$2"
              $group-window-xs={{
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Text
                fontSize="$5"
                $gtMd={{
                  fontSize: '$7',
                }}
                fontWeight="600"
              >
                {event.name}
              </Text>
            </View>

            <XStack display="flex" ai="center" gap="$2">
              <Clock size={15} />
              <Text fontSize="$1">{formatTime(event.startTime)}</Text>
            </XStack>

            <XStack display="flex" ai="center" gap="$2">
              <MapPin size={15} />
              <Text fontSize="$1">{event.location}</Text>
            </XStack>
          </View>

          <View
            justifyContent="center"
            gap="$5"
            mr="$4"
            $xs={{
              width: '100%',
              px: '$4',
              pb: '$4',
            }}
          >
            <Button
              onPress={() => {
                if (event.userRole === 'host') {
                  setManagedEventId(event.id);
                  setOpen(true);
                  setId(index);
                }
              }}
            >
              {event.userRole === 'host' ? 'Manage Event' : 'View Ticket'}
            </Button>
          </View>
        </YStack>
      </>
    );
  };

  const { sm, xs, gtSm, gtXs } = useMedia();
  const [layoutWidth, setLayoutWidth] = React.useState(0);

  const [id, setId] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState(0);

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setLayoutWidth(width);
  };

  return (
    <>
      <YStack bg="$background" fullscreen>
        {/* <Navigation /> */}

        <View px="$4" py="$8">
          <View mb="$5">
            <H3 mb="$2">My Events</H3>
            <Text>Your digital experiences collection</Text>
          </View>
          <Theme name="green">
            <Tabs value={activeTab} onValueChange={setActiveTab} flexDirection="column">
              <Tabs.List mb="$6">
                <Tabs.Tab value="upcoming" $xs={{ width: '50%' }}>
                  <Text>Upcoming</Text>
                </Tabs.Tab>
                <Tabs.Tab value="past" $xs={{ width: '50%' }}>
                  <Text>Past</Text>
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Content value="upcoming">
                {groupEventsByDate(upcomingEvents).map(([dateKey, events], index) => (
                  <View key={dateKey} pos="relative">
                    <View pos="absolute" bottom={0} left={4} top={16} w="$0.25" bg="$gray6" />

                    <View mb="$9">
                      <View pos="relative" pl="$6">
                        <View
                          bg="$green8"
                          pos="absolute"
                          left={1}
                          top={3}
                          h="$0.75"
                          w="$0.75"
                          borderRadius="$5"
                        />
                        <View mb="$4">
                          <Text fontSize="$2" color="$green9Light">
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

              <Tabs.Content value="past" className="space-y-0">
                {groupEventsByDate(pastEvents).map(([dateKey, events], index) => (
                  <View key={dateKey} pos="relative">
                    <View pos="absolute" bottom={0} left={4} top={16} w="$0.25" bg="$gray6" />

                    <View mb="$9">
                      <View pos="relative" pl="$6">
                        <View
                          bg="$green8"
                          pos="absolute"
                          left={1}
                          top={3}
                          h="$0.75"
                          w="$0.75"
                          borderRadius="$5"
                        />
                        <View mb="$4">
                          <Text fontSize="$2" color="$green9Light">
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
