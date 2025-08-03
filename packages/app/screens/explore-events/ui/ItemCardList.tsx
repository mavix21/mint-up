import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { YStack, XStack, Card, Image, View, Chip, Theme, SizableText } from '@my/ui';
import { formatDate, formatDateTime, formatRelativeDate } from '@my/ui/src/lib/dates';
import { SmallCardSkeleton } from 'app/shared/ui/SmallCardSkeleton';
import { EventModal } from 'app/widgets/event-modal';
import { useQuery } from 'convex/react';
import React from 'react';

import { RegistersAvatar } from './RegistersAvatar';

export function ItemCardList({ id }: { id: string }) {
  // Check if this is a loading placeholder ID
  const isPlaceholder = id.startsWith('loading-');

  const event = isPlaceholder
    ? null
    : useQuery(api.events.getEventById, {
        eventId: id as Id<'events'>,
      });

  const [toggleEvent, setToggleEvent] = React.useState(false);

  if (isPlaceholder || !event) {
    return (
      <View>
        <SmallCardSkeleton />
      </View>
    );
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
          <YStack flex={1} gap="$3">
            <SizableText size="$2" color="$color10" numberOfLines={1}>
              {formatDate(formatRelativeDate(event.startDate ?? 0))} •{' '}
              {formatDateTime(formatRelativeDate(event.startDate ?? 0))}
            </SizableText>
            <YStack gap="$2">
              <SizableText size="$5" color="$color" numberOfLines={3}>
                {event.name}
              </SizableText>
              <View alignItems="flex-start">
                <Chip size="$1" rounded paddingInline="$2">
                  <Chip.Text fontWeight="600">{event.category}</Chip.Text>
                </Chip>
              </View>
              <RegistersAvatar eventId={event._id ?? ''} />
            </YStack>
          </YStack>
        </XStack>
      </Card>
      <EventModal toggleEvent={toggleEvent} setToggleEvent={setToggleEvent} eventData={event} />
    </Theme>
  );
}
