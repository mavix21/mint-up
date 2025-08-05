import { YStack, XStack, Card, Image, View, Chip, Theme, SizableText, ThemeName } from '@my/ui';
import { formatDate, formatDateTime, formatRelativeDate } from '@my/ui/src/lib/dates';
import { ConvexEventWithExtras } from 'app/entities';
import { EventModal } from 'app/widgets/event-modal';
import React from 'react';

import { RegistersAvatar } from './RegistersAvatar';

export function ItemCardList({ event }: { event: ConvexEventWithExtras }) {
  const [toggleEvent, setToggleEvent] = React.useState(false);

  return (
    <Theme name={event.theme as ThemeName}>
      <Card
        key={event._id}
        elevate
        size="$4"
        bordered
        backgroundColor="$background"
        borderRadius="$4"
        pressStyle={{ scale: 0.975 }}
        hoverStyle={{ borderColor: '$borderColorHover' }}
        py="$3"
        pl="$3"
        // onPress={() => router.push(`/events/detail/${event._id}`)}
        onPress={() => setToggleEvent(true)}
      >
        <XStack gap="$3" alignItems="center">
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
              <RegistersAvatar event={event} />
            </YStack>
          </YStack>
        </XStack>
      </Card>
      <EventModal toggleEvent={toggleEvent} setToggleEvent={setToggleEvent} eventData={event} />
    </Theme>
  );
}
