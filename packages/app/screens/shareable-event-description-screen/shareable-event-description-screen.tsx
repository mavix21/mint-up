'use client';

import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { useQuery } from '@my/backend/react';
import { EventModal } from 'app/widgets/event-modal';
import React from 'react';

export const ShareableEventDescriptionScreen = ({ id }: { id: string }) => {
  const event = useQuery(api.events.getEventById, {
    eventId: id as Id<'events'>,
  });

  // Fetch tickets for this event
  const tickets = useQuery(api.ticketTemplates.getTicketsById, {
    eventId: id as Id<'events'>,
  });

  const [toggleEvent, setToggleEvent] = React.useState(true);

  if (event === undefined || tickets === undefined) {
    return null; // or a loading spinner
  }

  if (event === null) {
    return null; // or an error message
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
