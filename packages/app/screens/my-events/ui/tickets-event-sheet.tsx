import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { useQuery } from '@my/backend/react';
import { H2, Text, Sheet, YStack } from '@my/ui';
import React from 'react';
export interface TicketsEventSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
}
export function TicketsEventSheet({ open, onOpenChange, eventId }: TicketsEventSheetProps) {
  const ticketList = useQuery(api.ticketTemplates.getTicketsById, {
    eventId: eventId as Id<'events'>,
  });

  // Reset local state when sheet opens
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

  if (ticketList === undefined) {
    return <Text>Loading...</Text>;
  }

  return (
    <Sheet
      open={open}
      forceRemoveScrollEnabled={open}
      onOpenChange={handleOpenChange}
      snapPoints={[90]}
      defaultPosition={0}
      modal
      dismissOnOverlayPress
      dismissOnSnapToBottom
    >
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="$shadowColor"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame flex={1} justifyContent="center" alignItems="center" gap="$5">
        <Sheet.ScrollView>
          <YStack padding="$5" gap="$8">
            {ticketList.map((ticket) => (
              <H2>{ticket.name}</H2>
            ))}
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
