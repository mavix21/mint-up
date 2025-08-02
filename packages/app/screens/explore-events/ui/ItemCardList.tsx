import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { YStack, Text, XStack, Card, Image, View, Chip, Theme } from '@my/ui';
import { formatDate, formatDateTime, formatRelativeDate } from '@my/ui/src/lib/dates';
import { EventModal } from 'app/screens/my-events/ui/event-modal';
import { useQuery } from 'convex/react';
import React from 'react';

import { RegistersAvatar } from './RegistersAvatar';

export function ItemCardList({ id }: { id: string }) {
  const event = useQuery(api.events.getEventById, {
    eventId: id as Id<'events'>,
  });

  const [toggleEvent, setToggleEvent] = React.useState(false);

  if (event === undefined) {
    return <Text>Loading</Text>;
  }

  return (
    <Theme name={event.theme as any}>
      <Card
        key={event._id}
        elevate
        size="$4"
        bordered
        backgroundColor="$background"
        mx="$4"
        mt="$3"
        borderRadius="$4"
        pressStyle={{ scale: 0.975 }}
        hoverStyle={{ borderColor: '$borderColorHover' }}
        py="$3"
        pl="$3"
        // onPress={() => router.push(`/events/detail/${event._id}`)}
        onPress={() => setToggleEvent(true)}
      >
        <XStack space="$3" alignItems="center">
          {/* App Icon */}
          <Image
            width={100}
            height={100}
            borderRadius="$2"
            backgroundColor="white"
            src={event.imageUrl ?? ''}
          />

          {/* App Info */}
          <YStack flex={1} space="$1">
            <Text fontSize="$2" color="$color11" numberOfLines={1}>
              {formatDate(formatRelativeDate(event.startDate ?? 0))} •{' '}
              {formatDateTime(formatRelativeDate(event.startDate ?? 0))}
            </Text>
            <Text fontSize="$4" color="$color" numberOfLines={3}>
              {event.name}
            </Text>
            <YStack>
              <Chip rounded theme="green_active" maxWidth="$14" mt="$1.5">
                <Chip.Text fontSize="$1">{event.category}</Chip.Text>
              </Chip>
              <View mt="$2.5">
                <RegistersAvatar eventId={event._id ?? ''} />
              </View>
            </YStack>
          </YStack>
        </XStack>
      </Card>
      <EventModal toggleEvent={toggleEvent} setToggleEvent={setToggleEvent} eventData={event} />
    </Theme>
  );
}
