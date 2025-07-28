import { api } from '@my/backend/_generated/api';
import { Doc } from '@my/backend/_generated/dataModel';
import { FullscreenSpinner, H3, SizableText, Tabs, Text, View, YStack } from '@my/ui';
import { formatRelativeDate } from '@my/ui/src/lib/dates';
import { useQuery } from 'convex/react';
import React from 'react';

import { EventCard } from './ui/event-card';

// Define the type for events returned by getUpcomingEvents
export type ConvexEventWithExtras = Doc<'events'> & {
  creatorName: string;
  imageUrl: string | null;
};

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

const groupEventsByDate = (events: ConvexEventWithExtras[], activeTab: string) => {
  const grouped = events.reduce((acc, event) => {
    const dateKey =
      formatRelativeDate(event.startDate).split('T')[0] ?? formatRelativeDate(event.startDate);
    acc[dateKey] ??= [];
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, ConvexEventWithExtras[]>);

  return Object.entries(grouped).sort(([a], [b]) =>
    activeTab === 'upcoming' ? a.localeCompare(b) : b.localeCompare(a)
  );
};

export const MyEventsScreen = () => {
  const upcomingEvents = useQuery(api.events.getUpcomingEvents);
  const pastEvents = useQuery(api.events.getPastEvents);

  const [activeTab, setActiveTab] = React.useState('upcoming');

  if (!upcomingEvents) return <FullscreenSpinner />; // TODO: improve skeleton
  if (!pastEvents) return <FullscreenSpinner />; // TODO: improve skeleton

  return (
    <YStack
      fullscreen
      maxWidth={600}
      marginInline="auto"
      height="100%"
      px="$4"
      py="$3"
      overflowBlock="hidden"
    >
      {/* <Navigation /> */}

      <View mb="$5">
        <H3 mb="$2">My Events</H3>
        <Text>Your digital experiences collection</Text>
      </View>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        flexDirection="column"
        overflowBlock="hidden"
        height="100%"
      >
        <Tabs.List
          mb="$6"
          borderColor="$borderColor"
          borderWidth={1}
          width="100%"
          $gtSm={{ width: 'fit-content' as any }}
        >
          <Tabs.Tab value="upcoming" $sm={{ flexBasis: '50%' }}>
            <SizableText>Upcoming</SizableText>
          </Tabs.Tab>
          <Tabs.Tab value="past" $sm={{ flexBasis: '50%' }}>
            <SizableText>Past</SizableText>
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
                    <SizableText fontSize="$2" color="$color11">
                      {formatDate(formatRelativeDate(events[0]?.startDate) ?? '')}
                    </SizableText>
                    <SizableText fontSize="$2">
                      {getDayOfWeek(formatRelativeDate(events[0]?.startDate) ?? '')}
                    </SizableText>
                  </View>
                  <YStack gap="$4">
                    {events.map((event) => (
                      <EventCard key={event._id} event={event} isPast index={index} />
                    ))}
                  </YStack>
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
                      {formatDate(formatRelativeDate(events[0]?.startDate) ?? '')}
                    </Text>
                    <Text fontSize="$2">
                      {getDayOfWeek(formatRelativeDate(events[0]?.startDate) ?? '')}
                    </Text>
                  </View>
                  <YStack gap="$4">
                    {events.map((event) => (
                      <EventCard key={event._id} event={event} isPast index={index} />
                    ))}
                  </YStack>
                </View>
              </View>
            </View>
          ))}

          {/* {pastEvents.length === 0 && (
                <Text py="$12" ai="center">
                  No past events
                </Text>
              )} */}
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
};
