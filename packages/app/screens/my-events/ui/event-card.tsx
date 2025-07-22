import { View, YStack, XStack, Image, Text, Button } from '@my/ui';
import { ArrowRight, Clock, MapPin } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { Link } from 'solito/link';

import { EventModal } from './event-modal';
import { ConvexEventWithExtras } from '../my-events-screen';
import { formatRelativeDate } from '@my/ui/src/lib/dates';

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
  console.log(index);
  return (
    <>
      <YStack
        gap="$2"
        $xxs={{
          padding: '$0',
          paddingBlockEnd: '$4',
          gap: '$4',
        }}
        padding="$4"
        elevation="$2"
        borderRadius="$5"
        borderColor="$color6"
        borderWidth={1}
        borderStyle="solid"
        backgroundColor="$color1"
        onPress={() => setToggleEvent(true)}
      >
        <EventModal toggleEvent={toggleEvent} setToggleEvent={setToggleEvent} eventData={event} />

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
              height={120}
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
          <View flex={1} justifyContent="flex-start" gap="$2" $xxs={{ paddingInline: '$4' }}>
            <View
              flexDirection="row"
              alignItems="center"
              gap="$2"
              $group-window-xs={{
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Text
                fontSize="$5"
                $gtMd={{
                  fontSize: '$7',
                }}
                fontWeight="600"
              >
                {event.name}
              </Text>
            </View>
            <XStack display="flex" ai="center" gap="$2">
              <Clock size={15} />
              <Text fontSize="$1">{formatTime(formatRelativeDate(event.startDate))}</Text>
            </XStack>

            {typeof event.location === 'string' ? (
              <XStack display="flex" ai="center" gap="$2">
                <MapPin size={15} />
                <Text>{event.location}</Text>
              </XStack>
            ) : event.location?.type === 'online' ? (
              <XStack display="flex" ai="center" gap="$2">
                <MapPin size={15} />
                <Text fontSize="$1">{event.location.url}</Text>
              </XStack>
            ) : event.location?.type === 'in-person' ? (
              <XStack display="flex" ai="center" gap="$2">
                <MapPin size={15} />
                <Text fontSize="$1">{event.location.address}</Text>
              </XStack>
            ) : (
              <Text>Unknown location</Text>
            )}
          </View>
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
          <Link href={`/events/manage/${event._id}`}>
            <Button size="$2" icon={ArrowRight}>
              {/* {event.userRole === 'host' ? 'Manage Event' : 'View Ticket'} */}
              Manage Event
            </Button>
          </Link>
        </View>
      </YStack>
    </>
  );
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
