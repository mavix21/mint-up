import { Doc } from '@my/backend/_generated/dataModel';
import {
  Sheet,
  YStack,
  H4,
  View,
  RadioGroup,
  Button,
  useToastController,
  SizableText,
} from '@my/ui';
import React from 'react';

import { FreeTicketCard } from './components/FreeTicketCard';
import { PaidTicketCard } from './components/PaidTicketCard';
import { useTicketRegistration } from './hooks/use-ticket-registration';
import { useTicketTransaction } from './hooks/use-ticket-transaction';
import { isTicketFree, isTicketPaid } from './utils/ticket-types';

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
  const [error, setError] = React.useState<string | null>(null);

  // Initialize hooks
  const registrationHook = useTicketRegistration();
  const transactionHook = useTicketTransaction();

  // Get selected ticket
  const selectedTicket = React.useMemo(
    () => ticketList.find((ticket) => ticket._id === selectedTicketId) || null,
    [ticketList, selectedTicketId]
  );

  // Reset local state when sheet opens
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setError(null);
      setSelectedTicketId(null);
      registrationHook.resetState();
      transactionHook.resetTransaction();
    }
    onOpenChange(isOpen);
  };

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setError(null);
  };

  const handleRegister = async () => {
    if (!selectedTicket) {
      setError('Please select a ticket type');
      return;
    }

    setError(null);

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
        } else if (registrationHook.registrationState.error) {
          setError(registrationHook.registrationState.error);
        }
      } else if (isTicketPaid(selectedTicket)) {
        // For paid tickets, start transaction
        await transactionHook.purchaseTicket(selectedTicket);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  // Handle transaction success
  React.useEffect(() => {
    if (transactionHook.transactionState.isSuccess && transactionHook.transactionState.hash) {
      // Transaction succeeded, register the ticket
      registrationHook.registerTicket(eventId, selectedTicket!._id).then(() => {
        if (registrationHook.registrationState.success) {
          handleOpenChange(false);
          const message = `Registration successful! Transaction: ${transactionHook.transactionState.hash!.slice(
            0,
            10
          )}...`;
          toast.show(message, {
            type: 'success',
            preset: 'done',
          });
        } else if (registrationHook.registrationState.error) {
          setError(registrationHook.registrationState.error);
        }
      });
    }
  }, [transactionHook.transactionState.isSuccess, transactionHook.transactionState.hash]);

  // Handle transaction error
  React.useEffect(() => {
    if (transactionHook.transactionState.isError) {
      setError(transactionHook.transactionState.error || 'Transaction failed');
    }
  }, [transactionHook.transactionState.isError, transactionHook.transactionState.error]);

  const isProcessing =
    registrationHook.registrationState.isRegistering || transactionHook.transactionState.isPending;
  const hasError =
    registrationHook.registrationState.error || transactionHook.transactionState.error || error;
  const errorMessage =
    error ||
    registrationHook.registrationState.error ||
    transactionHook.transactionState.error ||
    'An error occurred';

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

            {hasError && (
              <View backgroundColor="$red2" padding="$3" borderRadius="$2">
                <SizableText color="$red10" size="$2">
                  {errorMessage}
                </SizableText>
              </View>
            )}

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
                    const isTransactionPending =
                      isSelected &&
                      isTicketPaid(ticket) &&
                      transactionHook.transactionState.isPending;

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
                          isTransactionPending={isTransactionPending}
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
          <Button size="$4" onPress={handleRegister} disabled={isProcessing || !selectedTicketId}>
            <Button.Text>
              {isProcessing
                ? transactionHook.transactionState.isPending
                  ? 'Processing transaction...'
                  : 'Registering...'
                : 'Register'}
            </Button.Text>
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
