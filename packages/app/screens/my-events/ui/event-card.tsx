import { View, YStack, XStack, Image, Theme, SizableText } from '@my/ui';
import { Clock, Globe, MapPin } from '@tamagui/lucide-icons';
import { formatTime } from 'app/shared';
import { useState } from 'react';

import { EventModal } from './event-modal';
import { ConvexEventWithExtras } from '../my-events-screen';

export function EventCard({
  event,
  isPast = false,
  index = 0,
}: {
  event: ConvexEventWithExtras;
  isPast?: boolean;
  index: number;
}) {
  //const [managedEventId, setManagedEventId] = useState<string | null>(null);
  const [toggleEvent, setToggleEvent] = useState(false);
  //const imageUrl = event.poapImageUrl ?? event.nftTicketImageUrl;
  //const showDimmed = isPast && !event.poapImageUrl;

  return (
    <>
      <Theme name={event.theme as any}>
        <YStack
          gap="$2"
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
          onPress={() => setToggleEvent(true)}
        >
          <XStack
            flexDirection="row-reverse"
            $xxs={{ flexDirection: 'column', alignItems: 'stretch' }}
            alignItems="center"
            gap="$4"
          >
            <View
              flexDirection="column"
              borderRadius="$4"
              $xxs={{
                width: '100%',
              }}
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
            </View>
            <YStack flex={1} justifyContent="flex-start" gap="$2" $xxs={{ paddingInline: '$4' }}>
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
                  {formatTime(event.startDate)}
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

          <View
            alignSelf="flex-start"
            justifyContent="center"
            gap="$5"
            $xxs={{ paddingInline: '$4' }}
          >
            {/* <Button
            size="$2"
            onPress={() => {
              if (event.userRole === 'host') {
                setManagedEventId(event.id);
                // setOpen(true);
                // setId(index);
              }
            }}
            icon={ArrowRight}
          >
            {event.userRole === 'host' ? 'Manage Event' : 'View Ticket'}
          </Button> */}
            {/*
            <Link href={`/events/manage/${event._id}`}>
              <Button size="$2" icon={ArrowRight}>
                // {event.userRole === 'host' ? 'Manage Event' : 'View Ticket'}
                Manage Event
              </Button>
            </Link>
            */}
          </View>
        </YStack>

        <EventModal toggleEvent={toggleEvent} setToggleEvent={setToggleEvent} eventData={event} />
      </Theme>
    </>
  );
}
