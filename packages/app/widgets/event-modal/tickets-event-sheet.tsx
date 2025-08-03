import { api } from '@my/backend/_generated/api';
import { Doc, Id } from '@my/backend/_generated/dataModel';
import {
  Sheet,
  YStack,
  H4,
  View,
  RadioGroup,
  Button,
  SizableText,
  useToastController,
} from '@my/ui';
import { useMutation } from 'convex/react';
import React from 'react';

import { TicketCardRadioButton } from './ticket-card-radio-button';

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
  const [value, setValue] = React.useState(ticketList[0]?._id);
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const createRegistration = useMutation(api.registrations.createRegistration);

  // Reset local state when sheet opens
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setError(null);
      setIsRegistering(false);
    }
    onOpenChange(isOpen);
  };

  const handleRegister = async () => {
    if (!value) {
      setError('Please select a ticket type');
      return;
    }

    setIsRegistering(true);
    setError(null);

    try {
      await createRegistration({
        eventId: eventId as Id<'events'>,
        ticketTemplateId: value,
      });

      // Close the sheet on success
      handleOpenChange(false);
      toast.show('Registration successful', {
        type: 'success',
        preset: 'done',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsRegistering(false);
    }
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

            {error && (
              <View backgroundColor="$red2" padding="$3" borderRadius="$2">
                <SizableText color="$red10" size="$2">
                  {error}
                </SizableText>
              </View>
            )}

            <View flex={1}>
              <RadioGroup
                flex={1}
                value={value}
                onValueChange={(value) => setValue(value as Id<'ticketTemplates'>)}
              >
                <View flexDirection="column" flex={1} flexWrap="wrap" gap="$2">
                  {ticketList.map((ticket) => (
                    <TicketCardRadioButton
                      key={ticket._id}
                      selected={value === ticket._id}
                      uniqueId={ticket._id}
                      setValue={(value) => setValue(value as Id<'ticketTemplates'>)}
                      description={ticket.description ?? ''}
                      price={ticket.price.type}
                      id={ticket._id}
                      label={ticket.name}
                    />
                  ))}
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
          <Button size="$4" onPress={handleRegister} disabled={isRegistering || !value}>
            <Button.Text>{isRegistering ? 'Registering...' : 'Register'}</Button.Text>
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
