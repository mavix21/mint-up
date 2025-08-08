import { Card, Chip, RadioGroup, SizableText, View, XStack, YStack } from '@my/ui';

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
      backgroundColor={selected ? '$color4' : undefined}
      borderColor={selected ? '$color8' : undefined}
    >
      <View onPress={(e) => e.stopPropagation()}>
        <RadioGroup.Item id={ticket._id} value={ticket._id} disabled={disabled}>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
      </View>

      <View flexDirection="column" flex={1}>
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1}>
            <SizableText
              size="$4"
              lineHeight="$2"
              fontWeight={selected ? '600' : '400'}
              color={selected ? '$color12' : undefined}
            >
              {ticket.name}
            </SizableText>
            {ticket.description && (
              <SizableText flexShrink={1} size="$3" fontWeight="300" color="$color9" marginTop="$1">
                {ticket.description}
              </SizableText>
            )}
            {ticket.totalSupply && (
              <SizableText size="$2" color="$color8" marginTop="$1">
                {ticket.totalSupply} available
              </SizableText>
            )}
          </YStack>

          <Chip theme="green" size="$2" rounded>
            <Chip.Text fontWeight="600">Free</Chip.Text>
          </Chip>
        </XStack>
      </View>
    </Card>
  );
}
