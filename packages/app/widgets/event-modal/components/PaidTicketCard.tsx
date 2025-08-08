import { Card, RadioGroup, SizableText, View, XStack, YStack, Spinner } from '@my/ui';

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
      backgroundColor={selected ? '$blue2' : undefined}
      borderColor={selected ? '$blue8' : undefined}
    >
      <View onPress={(e) => e.stopPropagation()}>
        <RadioGroup.Item id={ticket._id} value={ticket._id} disabled={disabled || !isSynced}>
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

          <YStack alignItems="flex-end" gap="$1">
            <View
              backgroundColor="$purple2"
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <SizableText size="$2" color="$purple10" fontWeight="600">
                {amount} {currency}
              </SizableText>
            </View>

            {/* Transaction pending indicator */}
            {isTransactionPending && selected && (
              <View
                backgroundColor="$blue2"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
                flexDirection="row"
                alignItems="center"
                gap="$1"
              >
                <Spinner size="small" color="$blue10" />
                <SizableText size="$2" color="$blue10" fontWeight="600">
                  Processing...
                </SizableText>
              </View>
            )}
          </YStack>
        </XStack>
      </View>
    </Card>
  );
}
