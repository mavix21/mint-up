import { api } from '@my/backend/_generated/api';
import {
  LoadingButton,
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
import { dateUtils } from 'app/shared/lib/date';
import { useSignIn } from 'app/shared/lib/hooks/use-sign-in';
import { Authenticated, Unauthenticated, useQuery } from 'convex/react';
import React, { useMemo } from 'react';

import { EventCard } from './ui/event-card';
import { CardSkeleton } from '../../shared/ui/CardSkeleton';

export const MyEventsScreen = () => {
  const { signIn, isLoading } = useSignIn();
  const allUserEvents = useQuery(api.events.getUserEvents);
  const [activeTab, setActiveTab] = React.useState('upcoming');

  // Memoize filtered events to avoid recalculation on every render
  const { upcomingEvents, pastEvents } = useMemo(() => {
    if (!allUserEvents) {
      return { upcomingEvents: [], pastEvents: [] };
    }

    const now = Date.now();
    const upcoming = allUserEvents.filter((event) => {
      // Event is upcoming if it hasn't ended yet (endDate > now)
      // If no endDate, fall back to startDate > now
      return event.endDate ? event.endDate > now : event.startDate > now;
    });
    const past = allUserEvents.filter((event) => {
      // Event is past if it has ended (endDate <= now)
      // If no endDate, fall back to startDate <= now
      return event.endDate ? event.endDate <= now : event.startDate <= now;
    });

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [allUserEvents]);

  if (!allUserEvents) return <FullscreenSpinner />;

  return (
    <YStack
      fullscreen
      maxWidth={600}
      marginInline="auto"
      height="100%"
      overflowBlock="hidden"
      style={{ overscrollBehavior: 'none' }}
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
        flex={1}
        size="$3"
        px="$4"
      >
        <Tabs.List
          mb="$4"
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

        <Tabs.Content value="upcoming" height="100%" overflowBlock="hidden" flex={1}>
          {upcomingEvents.length > 0 ? (
            <ScrollView flex={1}>
              {dateUtils
                .groupByDate(
                  upcomingEvents,
                  (event) => {
                    const date = new Date(event.startDate);
                    return date.toLocaleDateString(); // Uses user's locale and timezone
                  },
                  'asc'
                )
                .map(([dateKey, events], index) => (
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
                            {dateUtils.formatRelativeDate(events[0]?.startDate)}
                          </SizableText>
                          <SizableText fontSize="$2">
                            {dateUtils.getDayOfWeek(events[0]?.startDate)}
                          </SizableText>
                        </View>
                        <YStack gap="$2">
                          {events.map((event) => (
                            <EventCard key={event._id} event={event} />
                          ))}
                        </YStack>
                      </View>
                    </View>
                  </View>
                ))}
            </ScrollView>
          ) : upcomingEvents.length <= 0 ? (
            <YStack
              height="100%"
              alignItems="center"
              justifyContent="center"
              flex={1}
              gap="$4"
              padding="$4"
            >
              <Authenticated>
                <YStack gap="$2.5" alignItems="center" justifyContent="center">
                  <CalendarPlus size="$8" color="$color8" />
                  <SizableText size="$6" fontWeight="bold" color="$color10" textAlign="center">
                    No Upcoming Events Yet!
                  </SizableText>
                  <SizableText size="$4" color="$color9" textAlign="center" maxWidth={300}>
                    It looks like you don&apos;t have any events planned. Create a new one or
                    explore what&apos;s happening!
                  </SizableText>
                </YStack>
              </Authenticated>
              <Unauthenticated>
                <YStack gap="$2.5" alignItems="center" justifyContent="center">
                  <LogIn size="$8" color="$color8" />
                  <SizableText size="$6" fontWeight="bold" color="$color10" textAlign="center">
                    Sign In to Create Events!
                  </SizableText>
                  <SizableText size="$4" color="$color9" textAlign="center" maxWidth={300}>
                    Join our community to create events and build your collection.
                  </SizableText>
                  <LoadingButton
                    theme="green"
                    isLoading={isLoading}
                    themeInverse
                    size="$4"
                    onPress={signIn}
                    mt="$2"
                    label="Sign In"
                  />
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
        </Tabs.Content>

        <Tabs.Content value="past" height="100%" overflowBlock="hidden" flex={1}>
          {pastEvents.length > 0 ? (
            <ScrollView flex={1}>
              {dateUtils
                .groupByDate(
                  pastEvents,
                  (event) => {
                    const date = new Date(event.startDate);
                    return date.toLocaleDateString(); // Uses user's locale and timezone
                  },
                  'desc'
                )
                .map(([dateKey, events], index) => (
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
                            {dateUtils.formatRelativeDate(events[0]?.startDate)}
                          </SizableText>
                          <SizableText size="$2">
                            {dateUtils.getDayOfWeek(events[0]?.startDate)}
                          </SizableText>
                        </View>
                        <YStack gap="$2">
                          {events.map((event) => (
                            <EventCard key={event._id} event={event} />
                          ))}
                        </YStack>
                      </View>
                    </View>
                  </View>
                ))}
            </ScrollView>
          ) : pastEvents.length <= 0 ? (
            <YStack
              flex={1}
              height="100%"
              justifyContent="center"
              alignItems="center"
              gap="$4"
              padding="$4"
            >
              <Authenticated>
                <YStack gap="$2.5" alignItems="center" justifyContent="center">
                  <History size="$8" color="$gray8" />
                  <SizableText size="$6" fontWeight="bold" color="$gray10" textAlign="center">
                    No Past Events Found
                  </SizableText>
                  <SizableText size="$4" color="$gray9" textAlign="center" maxWidth={300}>
                    Once you attend or create events, they&apos;ll appear here for your review.
                    Start joining now!
                  </SizableText>
                </YStack>
              </Authenticated>
              <Unauthenticated>
                <YStack gap="$2.5" alignItems="center" justifyContent="center">
                  <History size="$8" color="$color8" />
                  <SizableText size="$6" fontWeight="bold" color="$color10" textAlign="center">
                    Your Event History Awaits!
                  </SizableText>
                  <SizableText size="$4" color="$color9" textAlign="center" maxWidth={300}>
                    Sign in to view your past events and track your journey.
                  </SizableText>
                  <LoadingButton
                    theme="green"
                    isLoading={isLoading}
                    themeInverse
                    size="$4"
                    onPress={signIn}
                    mt="$2"
                    label="Sign In"
                  />
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
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
};
