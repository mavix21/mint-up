import { Card, RadioGroup, SizableText, View, XStack, YStack, Spinner, Chip } from '@my/ui';

import { TicketTemplate, isOnchainTicket, isTicketSynced } from '../utils/ticket-types';

interface PaidTicketCardProps {
  ticket: TicketTemplate;
  selected: boolean;
  onSelect: (ticketId: string) => void;
  disabled?: boolean;
  isTransactionPending?: boolean;
}

export function PaidTicketCard({
  ticket,
  selected,
  onSelect,
  disabled = false,
  isTransactionPending = false,
}: PaidTicketCardProps) {
  if (!isOnchainTicket(ticket)) {
    return null;
  }

  const isSynced = isTicketSynced(ticket);
  const { amount, currency } = ticket.ticketType.price;

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
        <RadioGroup.Item id={ticket._id} value={ticket._id} disabled={disabled || !isSynced}>
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
            {ticket.description !== '' && (
              <SizableText flexShrink={1} size="$3" fontWeight="300" color="$color9" marginTop="$1">
                {ticket.description}
              </SizableText>
            )}
            {ticket.totalSupply && (
              <SizableText size="$2" color="$color8" marginTop="$1">
                {ticket.totalSupply} available
              </SizableText>
            )}

            {/* Sync status indicator */}
            {!isSynced && (
              <View
                backgroundColor="$orange2"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
                marginTop="$1"
              >
                <SizableText size="$2" color="$orange10" fontWeight="600">
                  Syncing to blockchain...
                </SizableText>
              </View>
            )}
          </YStack>

          <XStack alignItems="center" justifyContent="flex-end" gap="$2">
            {/* Transaction pending indicator */}
            {isTransactionPending && selected && (
              <View
                backgroundColor="$color2"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
                flexDirection="row"
                alignItems="center"
                gap="$1"
              >
                <Spinner size="small" color="$color10" />
                <SizableText size="$2" color="$color10" fontWeight="600">
                  Processing...
                </SizableText>
              </View>
            )}
            <Chip theme="purple" size="$2" rounded>
              <Chip.Text fontWeight="600">
                {amount} {currency}
              </Chip.Text>
            </Chip>
          </XStack>
        </XStack>
      </View>
    </Card>
  );
}
