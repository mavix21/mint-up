import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { useQuery } from '@my/backend/react';
import { formatRelativeDate, FullscreenSpinner, Sheet } from '@my/ui';
import dynamic from 'next/dynamic';
import { memo } from 'react';

const NftTicket = dynamic(() => import('../../entities/nft-ticket/nft-ticket'), {
  loading: () => <FullscreenSpinner />,
  ssr: false,
});

export interface TicketViewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: Id<'events'>;
  userId: Id<'users'>;
}

const TicketViewSheet = ({ open, onOpenChange, eventId, userId }: TicketViewSheetProps) => {
  // Reset local state when sheet opens
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

  const registration = useQuery(api.registrations.getRegistrationTicketByEventIdUserId, {
    eventId,
    userId,
  });

  if (!registration) {
    return <FullscreenSpinner />;
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `https://mint-up-mini.vercel.app/events/${registration.eventId}`
  )}`;

  return (
    <Sheet
      open={open}
      forceRemoveScrollEnabled={open}
      onOpenChange={handleOpenChange}
      disableDrag
      snapPoints={[90]}
      snapPointsMode="percent"
      zIndex={200_000}
      modal
      dismissOnOverlayPress
      dismissOnSnapToBottom
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="$shadowColor"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame flex={1} width="100%" gap="$5">
        <Sheet.ScrollView>
          <NftTicket
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
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

export default memo(TicketViewSheet);
