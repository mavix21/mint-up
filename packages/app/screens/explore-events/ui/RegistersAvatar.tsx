import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { Text } from '@my/ui';
import { useQuery } from 'convex/react';

import { AvatarGroup } from './AvatarGroup';
import { Item } from './Item';

export function RegistersAvatar({ eventId }: { eventId: string }) {
  const registers = useQuery(api.registrations.getRegistrationsByEventId, {
    eventId: eventId as Id<'events'>,
  });

  return (
    registers && (
      <AvatarGroup
        size="$3"
        items={registers.map((register) => (
          <Item
            key={register._id}
            size="$2"
            imageUrl="https://images.unsplash.com/photo-1736754079614-8b43bcba9926?w=100"
          />
        ))}
      />
    )
  );
}
