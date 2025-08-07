import { Doc } from '@my/backend/convex/_generated/dataModel';
import { Card, RadioGroup, SizableText, View, XStack, YStack } from '@my/ui';

type ItemProps = {
  ticket: Doc<'ticketTemplates'>;
  setValue: (value: string) => void;
  selected: boolean;
};

export function TicketCardRadioButton({ ticket, setValue, selected }: ItemProps) {
  return (
    <Card
      flexDirection="row"
      flexShrink={1}
      alignItems="flex-start"
      gap="$3"
      padding="$3"
      onPress={() => setValue(ticket._id)}
      cursor="pointer"
    >
      <View onPress={(e) => e.stopPropagation()}>
        <RadioGroup.Item id={ticket._id} value={ticket._id}>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
      </View>
      <View flexDirection="column" flexShrink={1}>
        <XStack>
          <YStack>
            <SizableText
              size="$4"
              lineHeight="$2"
              alignItems="flex-start"
              flexDirection="column"
              cursor="pointer"
            >
              {ticket.name}
            </SizableText>
            <SizableText flexShrink={1} size="$3" fontWeight="300" color="$gray9">
              {ticket.description}
            </SizableText>
          </YStack>
          {ticket.ticketType.type === 'offchain' ? (
            <SizableText>Free</SizableText>
          ) : (
            <SizableText>
              {ticket.ticketType.price.amount} {ticket.ticketType.price.currency}
            </SizableText>
          )}
        </XStack>
      </View>
    </Card>
  );
}
