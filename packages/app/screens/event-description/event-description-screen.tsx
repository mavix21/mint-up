import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { YStack, Text } from '@my/ui';
import { useQuery } from 'convex/react';
import { useParams } from 'solito/navigation';

export const EventDescriptionScreen = () => {
  const { id } = useParams<{ id: string }>();
  const event = useQuery(api.events.getEventById, {
    eventId: id as Id<'events'>,
  });
  return (
    <YStack>
      <Text>Event description {event?.name}</Text>
    </YStack>
  );
};
