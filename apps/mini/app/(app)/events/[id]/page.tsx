'use client';

import { Text } from '@my/ui';
import { useParams } from 'solito/navigation';

export default function EventDescriptionScreen() {
  const { id } = useParams<{ id: string }>();

  return <Text>Event: {id}</Text>;
}
