'use client';

import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { useQuery } from '@my/backend/react';
import { formatRelativeDate, FullscreenSpinner } from '@my/ui';
import NFTTicket from 'app/entities/nft-ticket/nft-ticket';

export const ShareableTicketViewScreen = ({ id }: { id: string }) => {
  const registration = useQuery(api.registrations.getRegistrationTicketById, {
    registrationId: id as Id<'registrations'>,
  });

  if (!registration) {
    return <FullscreenSpinner />;
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `https://mint-up-mini.vercel.app/events/${registration.eventId}`
  )}`;

  return (
    <NFTTicket
      eventName={registration.eventName}
      eventImageUrl={registration.eventImageUrl}
      startDate={new Date(formatRelativeDate(registration.startDate))}
      ticketName={registration.ticketName}
      location={registration.location}
      locationDetails={registration.locationDetails}
      ticketHolderName={registration.ticketHolder.name}
      ticketHolderUsername={registration.ticketHolder.username}
      ticketHolderAvatar={registration.ticketHolder.avatar}
      organizerName={registration.organizer.name}
      organizerEmail={registration.organizer.email}
      organizerAvatar={registration.organizer.avatar}
      tokenId={registration.tokenId}
      qrCodeData={qrUrl}
      style="silver"
    />
  );
};
