'use client';

import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { fetchQuery } from '@my/backend/nextjs';
import { useQuery } from '@my/backend/react';
import { EventModal } from 'app/widgets/event-modal';
import React from 'react';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await fetchQuery(api.events.getEventById, {
    eventId: id as Id<'events'>,
  });

  return {
    title: event?.name ?? 'Event not found',
    other: {
      'fc:frame': JSON.stringify({
        version: 'next',
        imageUrl: event?.imageUrl,
        button: {
          title: 'Mint your ticket',
          action: {
            type: 'launch_frame',
            name: 'Event Invite',
            url: process.env.NEXT_PUBLIC_URL,
          },
        },
      }),
    },
  };
}

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
