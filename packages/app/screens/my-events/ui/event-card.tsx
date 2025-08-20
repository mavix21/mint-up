import {
  View,
  YStack,
  XStack,
  Image,
  Theme,
  SizableText,
  ThemeName,
  Chip,
  LiveIndicator,
} from '@my/ui';
import { Clock, Globe, MapPin } from '@tamagui/lucide-icons';
import { ConvexEventWithExtras } from 'app/entities';
import { dateUtils } from 'app/shared/lib/date';
import { isEventLive } from 'app/shared/lib/utils';
import { EventModal } from 'app/widgets/event-modal';
import { useState } from 'react';

export function EventCard({ event }: { event: ConvexEventWithExtras }) {
  const [toggleEvent, setToggleEvent] = useState(false);

  // Check if event is currently live using the shared utility
  const eventIsLive = isEventLive(event.startDate, event.endDate);

  const getStatusChip = () => {
    if (event.isHost) {
      return (
        <Chip size="$1" theme="pink">
          <Chip.Text>Hosting</Chip.Text>
        </Chip>
      );
    }

    if (event.userStatus) {
      const statusConfig = {
        pending: { label: 'Pending', theme: 'yellow' as const },
        minted: { label: 'Going', theme: 'green' as const },
        rejected: { label: 'Rejected', theme: 'red' as const },
      };

      const config = statusConfig[event.userStatus as keyof typeof statusConfig];
      if (config) {
        return (
          <Chip size="$1" theme={config.theme}>
            <Chip.Text>{config.label}</Chip.Text>
          </Chip>
        );
      }
    }

    return null;
  };

  return (
    <>
      <Theme name={event.theme as ThemeName}>
        <XStack
          gap="$1"
          $xxs={{
            padding: '$0',
            paddingBlockEnd: '$4',
            gap: '$4',
          }}
          padding="$4"
          my="$2"
          elevation="$2"
          borderRadius="$5"
          borderColor="$color6"
          borderWidth={1}
          borderStyle="solid"
          backgroundColor="$color1"
          justifyContent="space-between"
          alignItems="center"
          onPress={() => setToggleEvent(true)}
        >
          <XStack
            flexDirection="row-reverse"
            flex={1}
            $xxs={{ flexDirection: 'column', alignItems: 'stretch' }}
            alignItems="center"
            gap="$4"
          >
            <YStack
              borderRadius="$4"
              $xxs={{
                width: '100%',
              }}
              position="relative"
              alignItems="flex-end"
            >
              <Image
                borderRadius={10}
                backgroundColor="$color5"
                objectFit="cover"
                height={108}
                aspectRatio={1}
                $xxs={{
                  height: 140,
                  width: '100%',
                }}
                $group-window-gtMd={{
                  minWidth: 'inherit',
                }}
                source={{ uri: event.imageUrl ?? '' }}
              />
              {eventIsLive && (
                <View position="absolute" top="$2" right="$2" zIndex={1}>
                  <LiveIndicator size="small" />
                </View>
              )}
            </YStack>
            <YStack flex={1} justifyContent="flex-start" gap="$2" $xxs={{ paddingInline: '$4' }}>
              <View alignSelf="flex-start" justifyContent="center" gap="$5">
                {getStatusChip()}
              </View>
              <View
                flexDirection="row"
                alignItems="center"
                gap="$2"
                $group-window-xs={{
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <SizableText
                  size="$5"
                  $gtMd={{
                    size: '$7',
                  }}
                  fontWeight="600"
                >
                  {event.name}
                </SizableText>
              </View>
              <XStack mt={4} display="flex" ai="center" gap="$2">
                <Clock size={15} color="$color11" />
                <SizableText size="$1" color="$color11">
                  {dateUtils.formatTime(event.startDate)}
                </SizableText>
              </XStack>

              {typeof event.location === 'string' ? (
                <XStack display="flex" ai="flex-start" gap="$2">
                  <MapPin size={15} color="$color11" />
                  <SizableText color="$color11">{event.location || 'Location TBD'}</SizableText>
                </XStack>
              ) : event.location?.type === 'online' ? (
                <XStack display="flex" ai="center" gap="$2">
                  <Globe size={15} color="$color11" />
                  {/* <Text fontSize="$1">{event.location.url}</Text> */}
                  <SizableText size="$1" color="$color11">
                    Online
                  </SizableText>
                </XStack>
              ) : event.location?.type === 'in-person' ? (
                <XStack display="flex" ai="flex-start" gap="$2">
                  <MapPin mt={2} size={15} flexShrink={0} color="$color11" />
                  <SizableText size="$1" color="$color11">
                    {event.location.address || 'Location TBD'}
                  </SizableText>
                </XStack>
              ) : (
                <SizableText color="$color11">Unknown location</SizableText>
              )}
            </YStack>
          </XStack>
        </XStack>

        <EventModal toggleEvent={toggleEvent} setToggleEvent={setToggleEvent} eventData={event} />
      </Theme>
    </>
  );
}
