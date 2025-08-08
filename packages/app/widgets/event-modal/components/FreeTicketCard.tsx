import { Card, RadioGroup, SizableText, View, XStack, YStack } from '@my/ui';

import { TicketTemplate, isOffchainTicket } from '../utils/ticket-types';

interface FreeTicketCardProps {
  ticket: TicketTemplate;
  selected: boolean;
  onSelect: (ticketId: string) => void;
  disabled?: boolean;
}

export function FreeTicketCard({
  ticket,
  selected,
  onSelect,
  disabled = false,
}: FreeTicketCardProps) {
  if (!isOffchainTicket(ticket)) {
    return null;
  }

  return (
    <Card
      flexDirection="row"
      flexShrink={1}
      alignItems="flex-start"
      gap="$3"
      padding="$3"
      onPress={() => !disabled && onSelect(ticket._id)}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.6 : 1}
      backgroundColor={selected ? '$blue2' : undefined}
      borderColor={selected ? '$blue8' : undefined}
    >
      <View onPress={(e) => e.stopPropagation()}>
        <RadioGroup.Item id={ticket._id} value={ticket._id} disabled={disabled}>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
      </View>

      <View flexDirection="column" flexShrink={1}>
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1}>
            <SizableText
              size="$4"
              lineHeight="$2"
              fontWeight={selected ? '600' : '400'}
              color={selected ? '$blue11' : undefined}
            >
              {ticket.name}
            </SizableText>
            {ticket.description && (
              <SizableText flexShrink={1} size="$3" fontWeight="300" color="$gray9" marginTop="$1">
                {ticket.description}
              </SizableText>
            )}
            {ticket.totalSupply && (
              <SizableText size="$2" color="$gray8" marginTop="$1">
                {ticket.totalSupply} available
              </SizableText>
            )}
          </YStack>

          <View
            backgroundColor="$green2"
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$2"
            alignItems="flex-end"
            justifyContent="flex-end"
          >
            <SizableText size="$2" color="$green10" fontWeight="600">
              Free
            </SizableText>
          </View>
        </XStack>
      </View>
    </Card>
  );
}
