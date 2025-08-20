'use client';

import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { useQuery } from '@my/backend/react';
import { Button, View, formatRelativeDate } from '@my/ui';
import NFTTicket from 'app/entities/nft-ticket/nft-ticket';
import { useRouter } from 'solito/router';

export const ShareableTicketViewScreen = ({ id }: { id: string }) => {
  const router = useRouter();
  const registration = useQuery(api.registrations.getRegistrationTicketById, {
    registrationId: id as Id<'registrations'>,
  });

  if (!registration) {
    return null;
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `https://mint-up-mini.vercel.app/events/${registration.eventId}`
  )}`;

  const handleGoToMiniApp = () => {
    router.push('/');
  };

  const handleViewEvent = () => {
    router.push(`/events/${registration.eventId}`);
  };

  return (
    <View
      height={'100vh' as any}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <View flex={1}>
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
      </View>

      <View
        padding="$4"
        gap="$3"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        backgroundColor="$background"
      >
        <Button onPress={handleGoToMiniApp}>Go to Mini App</Button>
        <Button themeInverse onPress={handleViewEvent}>
          View Event
        </Button>
      </View>
    </View>
  );
};
