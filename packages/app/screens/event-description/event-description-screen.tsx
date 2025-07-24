import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { formatDate, formatDateTime, formatRelativeDate } from '@my/ui/src/lib/dates';
import {
  YStack,
  Text,
  ScrollView,
  XStack,
  Card,
  Avatar,
  H3,
  Button,
  Image,
  Circle,
  Paragraph,
  View,
} from '@my/ui';
import { Calendar, ChevronLeft, Clock, Heart, MapPin } from '@tamagui/lucide-icons';
import { useQuery } from 'convex/react';
import React from 'react';
import { useParams } from 'solito/navigation';

export const EventDescriptionScreen = () => {
  const { id } = useParams<{ id: string }>();
  const event = useQuery(api.events.getEventById, {
    eventId: id as Id<'events'>,
  });
  const [showFullDescription, setShowFullDescription] = React.useState(false);
  if (event === undefined) {
    return <Text>Loading</Text>;
  }
  const shortDescription = (event.description.substring(0, 150) ?? '') + '...';

  return (
    <YStack flex={1} backgroundColor="$background" pb="$4">
      {/* Header Image and Overlay Card */}
      <View>
        <Image
          height={300}
          source={{ uri: event.imageUrl ?? '' }}
          borderBottomLeftRadius="$7"
          borderBottomRightRadius="$7"
        />
        <H3 mt="$3" px="$4">
          {event?.name}
        </H3>
      </View>
      <ScrollView flex={1} style={{ paddingHorizontal: 16 }}>
        <View>
          <YStack mt="$3">
            <XStack display="flex" gap="$2.5">
              <Clock size={15} mt="$1.5" color="$gray10" />
              <YStack>
                <Paragraph fontSize="$1" fontWeight="bold">
                  {formatDate(formatRelativeDate(event!.startDate!))}
                </Paragraph>
                <Paragraph fontSize="$1" color="$gray11">
                  {formatDateTime(formatRelativeDate(event!.startDate!))}
                </Paragraph>
              </YStack>
            </XStack>
            {typeof event.location === 'string' ? (
              <XStack display="flex" gap="$2.5">
                <MapPin size={15} mt="$1.5" color="$gray10" />
                <YStack>
                  <Text fontSize="$1" fontWeight="bold">
                    {event.location}
                  </Text>
                  {/* <Text fontSize="$1" color="$gray11">
                          San Miguel, Lima, Perú
                        </Text> */}
                </YStack>
              </XStack>
            ) : event.location?.type === 'online' ? (
              <XStack display="flex" gap="$2.5">
                <MapPin size={15} mt="$1.5" color="$gray10" />
                <YStack>
                  <Text fontSize="$1" fontWeight="bold">
                    {event.location.url}
                  </Text>
                  {/* <Text fontSize="$1" color="$gray11">
                          San Miguel, Lima, Perú
                        </Text> */}
                </YStack>
              </XStack>
            ) : event.location?.type === 'in-person' ? (
              <XStack display="flex" gap="$2.5">
                <MapPin size={15} mt="$1.5" color="$gray10" />
                <YStack>
                  <Text fontSize="$1" fontWeight="bold">
                    {event.location.address}
                  </Text>
                  {/* <Text fontSize="$1" color="$gray11">
                          San Miguel, Lima, Perú
                        </Text> */}
                </YStack>
              </XStack>
            ) : (
              <Text>Unknown location</Text>
            )}
          </YStack>
          <View mt="$3">
            <Text fontWeight="bold">About</Text>
            {/* <Text mt="$2">{event?.description}</Text> */}
            <Paragraph size="$4" numberOfLines={showFullDescription ? undefined : 3}>
              {showFullDescription ? event.description : shortDescription}
            </Paragraph>
            {!showFullDescription && (
              <Button
                variant="outlined"
                size="$2"
                mt="$2"
                onPress={() => setShowFullDescription(true)}
                alignSelf="flex-start"
              >
                Read more...
              </Button>
            )}
          </View>
        </View>
      </ScrollView>
    </YStack>
  );
};
