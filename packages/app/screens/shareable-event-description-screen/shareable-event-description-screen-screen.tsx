import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { useQuery } from '@my/backend/react';
import { EventModal } from 'app/widgets/event-modal';
import { ConvexEventWithExtras } from 'app/entities';
import React from 'react';

export const ShareableEventDescriptionScreenScreen = ({ id }: { id: string }) => {
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

  // Create the ConvexEventWithExtras object
  // const eventWithExtras: ConvexEventWithExtras = {
  //   ...event,
  //   imageUrl: event.imageUrl,
  //   tickets: tickets || [],
  //   creator: {
  //     name: event.creatorName || 'Anonymous',
  //     imageUrl: null, // We don't have this from getEventById
  //   },
  //   isHost: false, // We don't have user context in this component
  //   userStatus: undefined, // We don't have user context in this component
  // };

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
