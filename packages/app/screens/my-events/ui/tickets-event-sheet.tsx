import { api } from '@my/backend/_generated/api';
import { Doc, Id } from '@my/backend/_generated/dataModel';
import { useQuery } from '@my/backend/react';
import { H2, Text, Sheet, YStack, H4, View, RadioGroup } from '@my/ui';
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
  const [value, setValue] = React.useState(ticketList[0].name);
  console.log('value', value);
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
            <H4>Choose the tickets you prefer</H4>
            <View>
              {/* {ticketList.map((ticket) => (
                <H2>{ticket.name}</H2>
              ))} */}
              <RadioGroup flexShrink={1} value={value} onValueChange={setValue}>
                <View flexDirection="column" flexShrink={1} flexWrap="wrap" gap="$2">
                  {ticketList.map((ticket) => (
                    <TicketCardRadioButton
                      key={ticket._id}
                      selected={value === ticket.name}
                      uniqueId={ticket._id}
                      setValue={setValue}
                      description={ticket.description ?? ''}
                      id={ticket._id}
                      label={ticket.name}
                    />
                  ))}
                </View>
              </RadioGroup>
            </View>
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
