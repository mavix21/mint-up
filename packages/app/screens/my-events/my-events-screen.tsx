import { api } from '@my/backend/_generated/api';
import {
  Button,
  FullscreenSpinner,
  H3,
  Paragraph,
  ScrollView,
  SizableText,
  Tabs,
  View,
  YStack,
} from '@my/ui';
import { CalendarPlus, History, LogIn } from '@tamagui/lucide-icons';
import {
  formatRelativeDate as formatRelativeDateShared,
  getDayOfWeek,
  groupByDate,
} from 'app/shared';
import { useSignIn } from 'app/shared/lib/hooks/use-sign-in';
import { Authenticated, Unauthenticated, useQuery } from 'convex/react';
import React, { useMemo } from 'react';

import { EventCard } from './ui/event-card';
import { CardSkeleton } from '../../shared/ui/CardSkeleton';

export const MyEventsScreen = () => {
  const { signIn } = useSignIn();
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
      py="$3"
      overflowBlock="hidden"
    >
      <View mb="$4" px="$4">
        <H3 mb="$2">My Events</H3>
        <Paragraph color="$color11">Your digital experiences collection ✨</Paragraph>
      </View>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        flexDirection="column"
        overflowBlock="hidden"
        height="100%"
        size="$3"
        px="$4"
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

        <Tabs.Content value="upcoming" height="100%" paddingBottom={160}>
          <ScrollView flex={1} height="100%" maxHeight="100%">
            {upcomingEvents.length > 0 ? (
              groupByDate(
                upcomingEvents,
                (event) => {
                  const date = new Date(event.startDate);
                  return date.toLocaleDateString(); // Uses user's locale and timezone
                },
                'desc'
              ).map(([dateKey, events], index) => (
                <View key={dateKey} pos="relative">
                  <View pos="absolute" bottom={0} left={4} top={16} w={1} bg="$color8" />

                  <View mb="$5">
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
                        <SizableText fontSize="$2">
                          {getDayOfWeek(events[0]?.startDate)}
                        </SizableText>
                      </View>
                      <YStack gap="$2">
                        {events.map((event) => (
                          <EventCard key={event._id} event={event} isPast index={index} />
                        ))}
                      </YStack>
                    </View>
                  </View>
                </View>
              ))
            ) : upcomingEvents.length <= 0 ? (
              <YStack flex={1} justifyContent="center" alignItems="center" gap="$4" padding="$4">
                <Authenticated>
                  <CalendarPlus size="$8" color="$color8" />
                  <SizableText size="$6" fontWeight="bold" color="$color10" textAlign="center">
                    No Upcoming Events Yet!
                  </SizableText>
                  <SizableText size="$4" color="$color9" textAlign="center" maxWidth={300}>
                    It looks like you don&apos;t have any events planned. Create a new one or
                    explore what&apos;s happening!
                  </SizableText>
                </Authenticated>
                <Unauthenticated>
                  <YStack gap="$2.5" alignItems="center" justifyContent="center">
                    <LogIn size="$8" color="$color8" />
                    <SizableText size="$6" fontWeight="bold" color="$color10" textAlign="center">
                      Sign In to Create Events!
                    </SizableText>
                    <SizableText size="$4" color="$color9" textAlign="center" maxWidth={300}>
                      Join our community to create amazing events and build your digital experiences
                      collection.
                    </SizableText>
                    <Button
                      theme="green"
                      size="$4"
                      icon={<LogIn size={16} />}
                      onPress={signIn}
                      mt="$2"
                    >
                      Sign In
                    </Button>
                  </YStack>
                </Unauthenticated>
              </YStack>
            ) : (
              <YStack>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </YStack>
            )}
          </ScrollView>
        </Tabs.Content>

        <Tabs.Content value="past" height="100%" paddingBottom={160}>
          <ScrollView flex={1} height="100%" maxHeight="100%">
            {pastEvents.length > 0 ? (
              groupByDate(
                pastEvents,
                (event) => {
                  const date = new Date(event.startDate);
                  return date.toLocaleDateString(); // Uses user's locale and timezone
                },
                'desc'
              ).map(([dateKey, events], index) => (
                <View key={dateKey} pos="relative">
                  <View pos="absolute" bottom={0} left={4} top={16} w={1} bg="$color6" />

                  <View mb="$5">
                    <View pos="relative" pl="$5">
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
                        <SizableText size="$2" color="$color11">
                          {formatRelativeDateShared(events[0]?.startDate)}
                        </SizableText>
                        <SizableText size="$2">{getDayOfWeek(events[0]?.startDate)}</SizableText>
                      </View>
                      <YStack gap="$2">
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
                <Authenticated>
                  <History size="$8" color="$gray8" />
                  <SizableText size="$6" fontWeight="bold" color="$gray10" textAlign="center">
                    No Past Events Found
                  </SizableText>
                  <SizableText size="$4" color="$gray9" textAlign="center" maxWidth={300}>
                    Once you attend or create events, they&apos;ll appear here for your review.
                    Start joining now!
                  </SizableText>
                </Authenticated>
                <Unauthenticated>
                  <YStack gap="$2.5" alignItems="center" justifyContent="center">
                    <History size="$8" color="$color8" />
                    <SizableText size="$6" fontWeight="bold" color="$color10" textAlign="center">
                      Your Event History Awaits!
                    </SizableText>
                    <SizableText size="$4" color="$color9" textAlign="center" maxWidth={300}>
                      Sign in to view your past events and track your digital experiences journey.
                    </SizableText>
                    <Button
                      theme="green"
                      size="$4"
                      icon={<LogIn size={16} />}
                      onPress={signIn}
                      mt="$2"
                    >
                      Sign In
                    </Button>
                  </YStack>
                </Unauthenticated>
              </YStack>
            ) : (
              <YStack>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </YStack>
            )}
          </ScrollView>
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
};
