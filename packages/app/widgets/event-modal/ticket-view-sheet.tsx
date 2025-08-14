'use client';

import { Sheet, YStack, H4, View, RadioGroup, Button, useToastController } from '@my/ui';
import NFTTicket from 'app/entities/nft-ticket/nft-ticket';
import { memo } from 'react';

export interface TicketViewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TicketViewSheet = ({ open, onOpenChange }: TicketViewSheetProps) => {
  // Reset local state when sheet opens
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

  return (
    <Sheet
      open={open}
      forceRemoveScrollEnabled={open}
      onOpenChange={handleOpenChange}
      snapPoints={[90]}
      zIndex={200_000}
      modal
      dismissOnOverlayPress
      dismissOnSnapToBottom
      animation="lazy"
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
          <YStack padding="$4" gap="$8" flex={1}>
            <NFTTicket
              eventName="TO THE MOON"
              eventImageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tothemoon.jfif-zeYcehghP0BZmqpePzre0PLh7EyBCE.jpeg"
              startDate={new Date('2024-02-24T14:00:00')}
              ticketType="VIP ACCESS"
              location="VIRTUAL EVENT"
              locationDetails="Online Platform"
              ticketHolderName="John Doe"
              ticketHolderUsername="@johndoe"
              organizerName="Lunar Events Co."
              organizerEmail="contact@lunarevents.io"
              tokenId="#TM240224001"
              style="normal" // Pass the selected style to the ticket
            />
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

export default memo(TicketViewSheet);
