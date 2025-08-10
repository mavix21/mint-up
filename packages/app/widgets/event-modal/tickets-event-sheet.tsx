import { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { Doc } from '@my/backend/_generated/dataModel';
import { Sheet, YStack, H4, View, RadioGroup, Button, useToastController } from '@my/ui';
import React, { useCallback } from 'react';

import { useTicketRegistration } from './hooks/use-ticket-registration';
import { BuyTicketButton } from './ui/BuyTicketButton';
import { FreeTicketCard } from './ui/FreeTicketCard';
import { PaidTicketCard } from './ui/PaidTicketCard';
import { isTicketFree, isTicketPaid, isOnchainTicket } from './utils/ticket-types';

export interface TicketsEventSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  ticketList: Doc<'ticketTemplates'>[];
}

export function TicketsEventSheet({
  open,
  onOpenChange,
  eventId,
  ticketList,
}: TicketsEventSheetProps) {
  const toast = useToastController();
  const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(null);

  // Initialize hooks
  const registrationHook = useTicketRegistration();

  // Get selected ticket
  const selectedTicket = React.useMemo(
    () => ticketList.find((ticket) => ticket._id === selectedTicketId) || null,
    [ticketList, selectedTicketId]
  );

  // Reset local state when sheet opens
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedTicketId(null);
      registrationHook.resetState();
      // transactionHook.resetTransaction();
    }
    onOpenChange(isOpen);
  };

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId);
  };

  const handleRegister = async () => {
    if (!selectedTicket) {
      return;
    }

    try {
      if (isTicketFree(selectedTicket)) {
        // For free tickets, register directly
        await registrationHook.registerTicket(eventId, selectedTicket._id);

        if (registrationHook.registrationState.success) {
          handleOpenChange(false);
          toast.show('Registration successful!', {
            type: 'success',
            preset: 'done',
          });
        }
      } else if (isTicketPaid(selectedTicket)) {
        // For paid tickets, start transaction
        // await transactionHook.purchaseTicket(selectedTicket);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    switch (status.statusName) {
      case 'success':
        console.log('BUY TICKET SUCCESS');
        break;
      default:
        console.log(status);
    }
  }, []);

  const getButtonType = () => {
    if (!selectedTicket) {
      return (
        <Button disabled>
          <Button.Text>Select a ticket</Button.Text>
        </Button>
      );
    }

    if (isTicketFree(selectedTicket)) {
      return (
        <Button onPress={handleRegister} disabled={isProcessing || !selectedTicketId}>
          <Button.Text>{isProcessing ? 'Registering...' : 'Register'}</Button.Text>
        </Button>
      );
    }

    if (isOnchainTicket(selectedTicket)) {
      switch (selectedTicket.ticketType.syncStatus.status) {
        case 'pending':
          return (
            <Button disabled>
              <Button.Text>Syncing ticket...</Button.Text>
            </Button>
          );
        case 'error':
          return (
            <Button disabled>
              <Button.Text>Error syncing ticket</Button.Text>
            </Button>
          );
        default:
          return (
            <BuyTicketButton
              handleOnStatus={handleOnStatus}
              price={selectedTicket.ticketType.price.amount}
              tokenId={selectedTicket.ticketType.syncStatus.tokenId}
            />
          );
      }
    }

    return null;
  };

  const isProcessing = registrationHook.registrationState.isRegistering;

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
            <H4>Choose the tickets you prefer</H4>

            <View flex={1}>
              <RadioGroup
                flex={1}
                value={selectedTicketId || ''}
                onValueChange={handleTicketSelect}
                disabled={isProcessing}
              >
                <View flexDirection="column" flex={1} flexWrap="wrap" gap="$2">
                  {ticketList.map((ticket) => {
                    const isSelected = selectedTicketId === ticket._id;
                    const isTransactionPending = isSelected && isTicketPaid(ticket);
                    // && transactionHook.transactionState.isPending;

                    if (isTicketFree(ticket)) {
                      return (
                        <FreeTicketCard
                          key={ticket._id}
                          ticket={ticket}
                          selected={isSelected}
                          onSelect={handleTicketSelect}
                          disabled={isProcessing}
                        />
                      );
                    }

                    if (isTicketPaid(ticket)) {
                      return (
                        <PaidTicketCard
                          key={ticket._id}
                          ticket={ticket}
                          selected={isSelected}
                          onSelect={handleTicketSelect}
                          disabled={isProcessing}
                          isTransactionPending={false}
                        />
                      );
                    }

                    return null;
                  })}
                </View>
              </RadioGroup>
            </View>
          </YStack>
        </Sheet.ScrollView>

        {/* Fixed button at bottom */}
        <YStack
          padding="$5"
          backgroundColor="$background"
          borderTopWidth={1}
          borderTopColor="$borderColor"
        >
          {getButtonType()}
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
