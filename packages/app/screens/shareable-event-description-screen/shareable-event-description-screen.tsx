'use client';

import { api } from '@my/backend/_generated/api';
import { useQuery } from '@my/backend/react';
import { FullscreenSpinner, YStack, SizableText, Button } from '@my/ui';
import { AlertTriangle, Home } from '@tamagui/lucide-icons';
import { EventModal } from 'app/widgets/event-modal';
import React from 'react';
import { useRouter } from 'solito/navigation';

export const ShareableEventDescriptionScreen = ({ id }: { id: string }) => {
  const event = useQuery(api.events.getEventById, {
    eventId: id,
  });

  // Fetch tickets for this event
  const tickets = useQuery(api.ticketTemplates.getTicketsByEventId, {
    eventId: id,
  });

  const [toggleEvent, setToggleEvent] = React.useState(true);
  const router = useRouter();

  if (event === undefined || tickets === undefined) {
    return <FullscreenSpinner />; // or a loading spinner
  }

  if (event === null) {
    return (
      <YStack
        flex={1}
        height="100%"
        alignItems="center"
        justifyContent="center"
        padding="$4"
        gap="$4"
        backgroundColor="$color2"
      >
        <YStack
          alignItems="center"
          justifyContent="center"
          gap="$3"
          padding="$6"
          borderRadius="$4"
          backgroundColor="$color1"
          borderWidth={1}
          borderColor="$borderColor"
          maxWidth={400}
          width="100%"
        >
          <AlertTriangle size={48} color="$color11" />
          <YStack alignItems="center" gap="$2">
            <SizableText size="$6" fontWeight="600" color="$color">
              Event Not Found
            </SizableText>
            <SizableText size="$3" color="$color10" textAlign="center">
              This event may have been removed or the link is no longer valid.
            </SizableText>
          </YStack>
          <Button size="$4" themeInverse icon={<Home size={16} />} onPress={() => router.push('/')}>
            <Button.Text>Go Home</Button.Text>
          </Button>
        </YStack>
      </YStack>
    );
  }

  return (
    <EventModal
      toggleEvent={toggleEvent}
      setToggleEvent={() => {
        setToggleEvent(true);
      }}
      eventData={event}
    />
  );
};
