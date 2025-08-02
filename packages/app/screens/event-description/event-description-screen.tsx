import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { YStack, Text, XStack, Card, Image, View, Chip } from '@my/ui';
import { formatDate, formatDateTime, formatRelativeDate } from '@my/ui/src/lib/dates';
import { useQuery } from 'convex/react';
import React from 'react';
import { useParams } from 'solito/navigation';

import { RegistersAvatar } from '../explore-events/ui/RegistersAvatar';
import { EventModal } from '../my-events/ui/event-modal';

export const EventDescriptionScreen = () => {
  const { id } = useParams<{ id: string }>();
  const event = useQuery(api.events.getEventById, {
    eventId: id as Id<'events'>,
  });
  const [toggleEvent, setToggleEvent] = React.useState(false);
  if (event === undefined) {
    return <Text>Loading event-description-screen</Text>;
  }

  return (
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
      // onPress={() => router.push(`/events/detail/${event._id}`)}
      onPress={() => setToggleEvent(true)}
    >
      <EventModal toggleEvent={toggleEvent} setToggleEvent={setToggleEvent} eventData={event} />
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

    // <YStack flex={1} backgroundColor="$background" pb="$4">
    //   {/* Header Image and Overlay Card */}
    //   <View>
    //     <Image
    //       height={300}
    //       source={{ uri: event.imageUrl ?? '' }}
    //       borderBottomLeftRadius="$7"
    //       borderBottomRightRadius="$7"
    //     />
    //     <H3 mt="$3" px="$4">
    //       {event?.name}
    //     </H3>
    //   </View>
    //   <ScrollView flex={1} style={{ paddingHorizontal: 16 }}>
    //     <View>
    //       <YStack mt="$3">
    //         <XStack display="flex" gap="$2.5">
    //           <Clock size={15} mt="$1.5" color="$gray10" />
    //           <YStack>
    //             <Paragraph fontSize="$1" fontWeight="bold">
    //               {formatDate(formatRelativeDate(event!.startDate!))}
    //             </Paragraph>
    //             <Paragraph fontSize="$1" color="$gray11">
    //               {formatDateTime(formatRelativeDate(event!.startDate!))}
    //             </Paragraph>
    //           </YStack>
    //         </XStack>
    //         {typeof event.location === 'string' ? (
    //           <XStack display="flex" gap="$2.5">
    //             <MapPin size={15} mt="$1.5" color="$gray10" />
    //             <YStack>
    //               <Text fontSize="$1" fontWeight="bold">
    //                 {event.location}
    //               </Text>
    //               {/* <Text fontSize="$1" color="$gray11">
    //                       San Miguel, Lima, Perú
    //                     </Text> */}
    //             </YStack>
    //           </XStack>
    //         ) : event.location?.type === 'online' ? (
    //           <XStack display="flex" gap="$2.5">
    //             <MapPin size={15} mt="$1.5" color="$gray10" />
    //             <YStack>
    //               <Text fontSize="$1" fontWeight="bold">
    //                 {event.location.url}
    //               </Text>
    //               {/* <Text fontSize="$1" color="$gray11">
    //                       San Miguel, Lima, Perú
    //                     </Text> */}
    //             </YStack>
    //           </XStack>
    //         ) : event.location?.type === 'in-person' ? (
    //           <XStack display="flex" gap="$2.5">
    //             <MapPin size={15} mt="$1.5" color="$gray10" />
    //             <YStack>
    //               <Text fontSize="$1" fontWeight="bold">
    //                 {event.location.address}
    //               </Text>
    //               {/* <Text fontSize="$1" color="$gray11">
    //                       San Miguel, Lima, Perú
    //                     </Text> */}
    //             </YStack>
    //           </XStack>
    //         ) : (
    //           <Text>Unknown location</Text>
    //         )}
    //       </YStack>
    //       <View mt="$3">
    //         <Text fontWeight="bold">About</Text>
    //         {/* <Text mt="$2">{event?.description}</Text> */}
    //         <Paragraph size="$4" numberOfLines={showFullDescription ? undefined : 3}>
    //           {showFullDescription ? event.description : shortDescription}
    //         </Paragraph>
    //         {!showFullDescription && (
    //           <Button
    //             variant="outlined"
    //             size="$2"
    //             mt="$2"
    //             onPress={() => setShowFullDescription(true)}
    //             alignSelf="flex-start"
    //           >
    //             Read more...
    //           </Button>
    //         )}
    //       </View>
    //     </View>
    //   </ScrollView>
    // </YStack>
  );
};
