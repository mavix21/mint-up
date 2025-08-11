import { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { api } from '@my/backend/_generated/api';
import { Doc, Id } from '@my/backend/_generated/dataModel';
import { useMutation } from '@my/backend/react';
import { Sheet, YStack, H4, View, RadioGroup, Button, useToastController } from '@my/ui';
import { abi } from 'app/shared/lib/abi';
import React, { memo, useCallback } from 'react';
import { parseEventLogs } from 'viem';

import { usePendingRegistrationService } from './services/pending-registration.service';
import { BuyTicketButton } from './ui/BuyTicketButton';
import { FreeTicketCard } from './ui/FreeTicketCard';
import { PaidTicketCard } from './ui/PaidTicketCard';
import { isTicketFree, isTicketPaid, isOnchainTicket } from './utils/ticket-types';

export interface TicketsEventSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: Id<'events'>;
  ticketList: Doc<'ticketTemplates'>[];
}

const TicketsEventSheet = ({ open, onOpenChange, eventId, ticketList }: TicketsEventSheetProps) => {
  const toast = useToastController();
  const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  console.log('selectedTicketId', selectedTicketId);
  // Initialize hooks
  const createRegistration = useMutation(api.registrations.createRegistration);
  const { storePendingRegistration } = usePendingRegistrationService();

  // Get selected ticket
  const selectedTicket = ticketList.find((ticket) => ticket._id === selectedTicketId) || null;
  console.log('selectedTicket', selectedTicket);

  // Reset local state when sheet opens
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedTicketId(null);
    }
    onOpenChange(isOpen);
  };

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId);
  };

  const handleRegister = useCallback(async () => {
    if (!selectedTicket) {
      return;
    }

    try {
      await createRegistration({
        eventId,
        ticketTemplateId: selectedTicket._id,
      });
      onOpenChange(false);
      toast.show('Registration successful!', {
        type: 'success',
        preset: 'done',
      });
    } catch (err) {
      console.error(err);
      toast.show('Registration failed. Please try again.', {
        type: 'error',
        preset: 'error',
      });
    }
  }, [selectedTicket, eventId, createRegistration, onOpenChange, toast]);

  const handleOnStatus = useCallback(
    async (status: LifecycleStatus) => {
      switch (status.statusName) {
        case 'init': {
          console.log('init');
          break;
        }
        case 'transactionIdle':
        case 'buildingTransaction': {
          console.log(status.statusName);
          setIsProcessing(true);
          break;
        }
        case 'success': {
          const { transactionReceipts } = status.statusData;
          try {
            const { logs, transactionHash } = transactionReceipts[0];
            const events = parseEventLogs({
              abi,
              logs,
            });

            for (const event of events) {
              if (event.eventName === 'TransferSingle') {
                const { id, to } = event.args;

                try {
                  await createRegistration({
                    eventId,
                    ticketTemplateId: selectedTicket!._id,
                    transactionReceipt: {
                      tokenId: id.toString(),
                      walletAddress: to,
                      transactionHash,
                    },
                  });

                  // Success - show success message
                  toast.show('Registration successful!', {
                    type: 'success',
                    preset: 'done',
                  });
                } catch (error) {
                  console.error('Failed to register in Convex:', error);

                  // Store pending registration for background sync
                  storePendingRegistration({
                    eventId,
                    ticketTemplateId: selectedTicket!._id,
                    transactionHash,
                    tokenId: id.toString(),
                    walletAddress: to,
                  });

                  // Show user-friendly message
                  toast.show("Payment successful! We're syncing your ticket...", {
                    type: 'success',
                    preset: 'done',
                  });
                } finally {
                  onOpenChange(false);
                  break;
                }
              }
            }
          } catch (error) {
            console.error('Error parsing transaction logs:', error);
            toast.show('Error processing transaction', {
              type: 'error',
              preset: 'error',
            });
          } finally {
            setIsProcessing(false);
          }
          break;
        }
        case 'error': {
          setIsProcessing(false);
          break;
        }
        default:
          console.log(status);
      }
    },
    [
      handleRegister,
      selectedTicket,
      eventId,
      createRegistration,
      onOpenChange,
      toast,
      storePendingRegistration,
    ]
  );

  const getButtonText = (isProcessing: boolean) => {
    return isProcessing ? 'Registering...' : 'Register';
  };

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
        <Button onPress={handleRegister} disabled={isProcessing}>
          <Button.Text>{getButtonText(isProcessing)}</Button.Text>
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
                          isTransactionPending={isProcessing}
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
};

export default memo(TicketsEventSheet);
