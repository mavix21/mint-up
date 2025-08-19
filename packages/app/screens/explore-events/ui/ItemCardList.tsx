import {
  YStack,
  XStack,
  Card,
  Image,
  View,
  Chip,
  Theme,
  SizableText,
  ThemeName,
  LiveIndicator,
} from '@my/ui';
import { formatDate, formatDateTime, formatRelativeDate } from '@my/ui/src/lib/dates';
import { ConvexEventWithExtras } from 'app/entities';
import { isEventLive } from 'app/shared/lib/utils';
import { EventModal } from 'app/widgets/event-modal';
import React from 'react';

import { HostsAvatar } from './HostsAvatar';
import { RegistersAvatar } from './RegistersAvatar';

export function ItemCardList({ event }: { event: ConvexEventWithExtras }) {
  const [toggleEvent, setToggleEvent] = React.useState(false);

  // Check if event is currently live using the shared utility
  const eventIsLive = isEventLive(event.startDate, event.endDate);

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
          <View position="relative">
            <Image
              width={100}
              height={100}
              borderRadius="$2"
              backgroundColor="white"
              src={event.imageUrl ?? ''}
            />
            {eventIsLive && (
              <View position="absolute" top="$1" right="$1" zIndex={1}>
                <LiveIndicator size="small" />
              </View>
            )}
          </View>

          {/* App Info */}
          <YStack flex={1}>
            <YStack gap="$2">
              <SizableText size="$2" color="$color10" numberOfLines={1}>
                {formatDate(formatRelativeDate(event.startDate ?? 0))} •{' '}
                {formatDateTime(formatRelativeDate(event.startDate ?? 0))}
              </SizableText>
              <SizableText size="$5" color="$color" numberOfLines={3}>
                {event.name}
              </SizableText>

              <XStack gap="$6">
                <YStack minWidth="$14" gap="$2">
                  <View alignItems="flex-start">
                    <Chip size="$1" rounded paddingInline="$2">
                      <Chip.Text fontWeight="600">{event.category}</Chip.Text>
                    </Chip>
                  </View>
                  <RegistersAvatar event={event} />
                </YStack>
                <YStack gap="$2">
                  <SizableText size="$1" color="$color10" fontWeight="600">
                    Host
                  </SizableText>
                  <XStack gap="$2" alignItems="center">
                    <HostsAvatar event={event} />
                    <SizableText size="$1" color="$color10" fontWeight="$5">
                      {event.creator.username}
                    </SizableText>
                  </XStack>
                </YStack>
              </XStack>
            </YStack>
            {/* 
            <XStack>
              <YStack width="$15">
                <SizableText size="$1"> </SizableText>
                <View justifyContent="center"></View>
              </YStack>
              <YStack></YStack>
            </XStack> */}
          </YStack>
        </XStack>
      </Card>
      <EventModal toggleEvent={toggleEvent} setToggleEvent={setToggleEvent} eventData={event} />
    </Theme>
  );
}
