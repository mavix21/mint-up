import { api } from '@my/backend/_generated/api';
import { FullscreenSpinner, H3, SizableText, Tabs, Text, View, YStack } from '@my/ui';
import { CalendarPlus, History } from '@tamagui/lucide-icons';
import {
  formatRelativeDate as formatRelativeDateShared,
  getDayOfWeek,
  groupByDate,
} from 'app/shared';
import { useQuery } from 'convex/react';
import React, { useMemo } from 'react';

import { EventCard } from './ui/event-card';
import { CardSkeleton } from '../../shared/ui/CardSkeleton';

export const MyEventsScreen = () => {
  const allUserEvents = useQuery(api.events.getUserEvents);
  const [activeTab, setActiveTab] = React.useState('upcoming');

  // Memoize filtered events to avoid recalculation on every render
  const { upcomingEvents, pastEvents } = useMemo(() => {
    if (!allUserEvents) {
      return { upcomingEvents: [], pastEvents: [] };
    }

    const today = Date.now();
    const upcoming = allUserEvents.filter((event) => event.startDate > today);
    const past = allUserEvents.filter((event) => event.startDate <= today);

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [allUserEvents]);

  if (!allUserEvents) return <FullscreenSpinner />;

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

        <Tabs.Content value="upcoming" overflowBlock="scroll" height="100%" paddingBottom={160}>
          {upcomingEvents.length > 0 ? (
            groupByDate(
              upcomingEvents,
              (event) => {
                const date = new Date(event.startDate);
                return date.toLocaleDateString(); // Uses user's locale and timezone
              },
              activeTab === 'upcoming' ? 'asc' : 'desc'
            ).map(([dateKey, events], index) => (
              <View key={dateKey} pos="relative">
                <View pos="absolute" bottom={0} left={4} top={16} w="$0.25" bg="$gray6" />

                <View mb="$9">
                  <View pos="relative" pl="$5">
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
                        {formatRelativeDateShared(events[0]?.startDate)}
                      </SizableText>
                      <SizableText fontSize="$2">{getDayOfWeek(events[0]?.startDate)}</SizableText>
                    </View>
                    <YStack gap="$4">
                      {events.map((event) => (
                        <EventCard key={event._id} event={event} isPast index={index} />
                      ))}
                    </YStack>
                  </View>
                </View>
              </View>
            ))
          ) : upcomingEvents.length <= 0 ? (
            <YStack
              flex={1} // Takes up available space
              justifyContent="center" // Centers content vertically
              alignItems="center" // Centers content horizontally
              gap="$4" // Adds space between items
              padding="$4" // Adds padding around the content
            >
              <CalendarPlus size="$8" color="$gray8" /> {/* Larger icon to draw attention */}
              <Text
                fontSize="$6" // Larger font for the main message
                fontWeight="bold"
                color="$gray10"
                textAlign="center"
              >
                No Upcoming Events Yet!
              </Text>
              <Text
                fontSize="$4" // Slightly smaller for descriptive text
                color="$gray9"
                textAlign="center"
                maxWidth={300} // Constrain text width for better readability
              >
                It looks like you don&apos;t have any events planned. Create a new one or explore
                what&apos;s happening!
              </Text>
            </YStack>
          ) : (
            <YStack>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </YStack>
          )}
        </Tabs.Content>

        <Tabs.Content
          value="past"
          className="space-y-0"
          overflowBlock="scroll"
          height="100%"
          paddingInlineEnd="$4"
          paddingBottom={160}
        >
          {pastEvents.length > 0 ? (
            groupByDate(
              pastEvents,
              (event) => {
                const date = new Date(event.startDate);
                return date.toLocaleDateString(); // Uses user's locale and timezone
              },
              activeTab === 'upcoming' ? 'asc' : 'desc'
            ).map(([dateKey, events], index) => (
              <View key={dateKey} pos="relative">
                <View pos="absolute" bottom={0} left={4} top={16} w="$0.25" bg="$gray6" />

                <View mb="$9">
                  <View pos="relative" pl="$4">
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
                        {formatRelativeDateShared(events[0]?.startDate)}
                      </Text>
                      <Text fontSize="$2">{getDayOfWeek(events[0]?.startDate)}</Text>
                    </View>
                    <YStack gap="$4">
                      {events.map((event) => (
                        <EventCard key={event._id} event={event} isPast index={index} />
                      ))}
                    </YStack>
                  </View>
                </View>
              </View>
            ))
          ) : pastEvents.length <= 0 ? (
            <YStack flex={1} justifyContent="center" alignItems="center" space="$4" padding="$4">
              <History size="$8" color="$gray8" /> {/* Icon related to history/past */}
              <Text fontSize="$6" fontWeight="bold" color="$gray10" textAlign="center">
                No Past Events Found
              </Text>
              <Text fontSize="$4" color="$gray9" textAlign="center" maxWidth={300}>
                Once you attend or create events, they&apos;ll appear here for your review. Start
                joining now!
              </Text>
            </YStack>
          ) : (
            <YStack>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </YStack>
          )}

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
