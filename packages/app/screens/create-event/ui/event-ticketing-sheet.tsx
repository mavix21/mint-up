import {
  Sheet,
  Button,
  XStack,
  YStack,
  Text,
  Input,
  TextArea,
  Label,
  ToggleGroup,
  Separator,
  Card,
  ScrollView,
  SizableText,
  Select,
  Group,
  useTheme,
  getTokens,
  useVisualViewportHeight,
} from '@my/ui';
import { Plus, Trash2, ChevronDown } from '@tamagui/lucide-icons';
import { useStore } from '@tanstack/react-form';
import type { Cryptocurrency, TicketType } from 'app/entities';
import { withForm } from 'app/shared/lib/form';

import { createEventFormOpts } from '../model/shared-form';

export interface EventTicketingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EventTicketingSheet = withForm({
  ...createEventFormOpts,
  props: {
    open: false,
    onOpenChange: () => {},
  } as EventTicketingSheetProps,
  render: function EventTicketingSheet({ open, onOpenChange, form }) {
    const theme = useTheme();
    const tokens = getTokens();
    const visualViewportHeight = useVisualViewportHeight();

    const ticketsFromStore = useStore(form.store, (state) => state.values.tickets || []);

    const handleSave = () => {
      onOpenChange(false);
    };

    const handleCancel = () => {
      onOpenChange(false);
    };

    return (
      <Sheet
        open={open}
        onOpenChange={onOpenChange}
        snapPoints={[100]}
        defaultPosition={0}
        modal
        disableDrag
        dismissOnOverlayPress={false}
        dismissOnSnapToBottom={false}
      >
        <Sheet.Overlay
          animation="lazy"
          backgroundColor="$shadowColor"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame
          py="$4"
          backgroundColor="$color2"
          key={visualViewportHeight}
          style={{ height: visualViewportHeight }}
        >
          <YStack flex={1} width="100%" maxWidth={496} marginHorizontal="auto">
            {/* Header */}
            <XStack alignItems="center" justifyContent="space-between" px="$4" pb="$3">
              <Text fontSize="$6" fontWeight="600">
                Event Tickets
              </Text>
            </XStack>

            <Separator />

            {/* Content */}
            <ScrollView flex={1} px="$4" py="$3">
              <form.AppField
                name="tickets"
                mode="array"
                children={(field) => {
                  const tickets = field.state.value || [];

                  return (
                    <YStack gap="$4">
                      {tickets.length === 0 ? (
                        <YStack alignItems="center" py="$8" gap="$3">
                          <Text fontSize="$4" color="$color10" textAlign="center">
                            No tickets created yet
                          </Text>
                          <Text fontSize="$3" color="$color9" textAlign="center">
                            Add your first ticket type to get started
                          </Text>
                        </YStack>
                      ) : (
                        tickets.map((ticket: TicketType, index: number) => {
                          const ticketType = ticketsFromStore[index]?.type || 'free';

                          return (
                            <Card
                              key={ticket.id}
                              borderColor="$color5"
                              borderWidth={1}
                              borderRadius="$4"
                              p="$4"
                            >
                              <YStack gap="$3">
                                {/* Ticket Header */}
                                <XStack alignItems="center" justifyContent="space-between">
                                  <SizableText fontSize="$4" fontWeight="600">
                                    Ticket {index + 1}
                                  </SizableText>
                                  {tickets.length > 1 && (
                                    <Button
                                      size="$2"
                                      circular
                                      theme="red"
                                      onPress={() => field.removeValue(index)}
                                      icon={<Trash2 size={14} />}
                                    />
                                  )}
                                </XStack>

                                {/* Ticket Name */}
                                <form.AppField
                                  name={`tickets[${index}].name`}
                                  children={(nameField) => (
                                    <YStack gap="$1">
                                      <Label htmlFor={`ticket-name-${ticket.id}`}>
                                        Ticket Name
                                      </Label>
                                      <Input
                                        id={`ticket-name-${ticket.id}`}
                                        placeholder="e.g., Early Bird, VIP, General Admission"
                                        value={nameField.state.value || ''}
                                        onChangeText={nameField.handleChange}
                                        backgroundColor="$color4"
                                        borderColor="$color5"
                                        borderRadius="$4"
                                      />
                                    </YStack>
                                  )}
                                />

                                {/* Price Type */}
                                <YStack gap="$1">
                                  <Label>Price Type</Label>
                                  <ToggleGroup
                                    type="single"
                                    value={ticketType}
                                    borderRadius="$4"
                                    orientation="horizontal"
                                    size="$3"
                                    onValueChange={(value: TicketType['type']) => {
                                      if (!value) return;

                                      if (value === 'paid') {
                                        // When switching to paid, ensure we have price and currency
                                        form.setFieldValue(`tickets[${index}]`, {
                                          id: ticket.id,
                                          name: ticket.name ?? '',
                                          description: ticket.description ?? '',
                                          supply: ticket.supply,
                                          type: 'paid',
                                          price: 0,
                                          currency: 'USDC',
                                        } as TicketType);
                                      } else {
                                        // When switching to free, remove price and currency
                                        form.setFieldValue(`tickets[${index}]`, {
                                          id: ticket.id,
                                          name: ticket.name ?? '',
                                          description: ticket.description ?? '',
                                          supply: ticket.supply,
                                          type: 'free',
                                        } as TicketType);
                                      }
                                    }}
                                  >
                                    <ToggleGroup.Item value="free" flex={1} borderRadius="$4">
                                      <SizableText>Free</SizableText>
                                    </ToggleGroup.Item>
                                    <ToggleGroup.Item value="paid" flex={1} borderRadius="$4">
                                      <SizableText>Paid</SizableText>
                                    </ToggleGroup.Item>
                                  </ToggleGroup>
                                </YStack>

                                {/* Price and Currency (only for paid tickets) */}
                                {ticketType === 'paid' && (
                                  <YStack gap="$1">
                                    <Label>Price & Currency</Label>
                                    <Group
                                      orientation="horizontal"
                                      separator={<Separator vertical />}
                                    >
                                      <Group.Item>
                                        <form.AppField
                                          name={`tickets[${index}].price`}
                                          children={(priceField) => (
                                            <YStack flex={1}>
                                              <input
                                                id={`ticket-price-${ticket.id}`}
                                                placeholder="0.00"
                                                value={priceField.state.value?.toString() || ''}
                                                onChange={(e) => {
                                                  priceField.handleChange(e.target.valueAsNumber);
                                                }}
                                                min={0}
                                                step={0.0001}
                                                type="number"
                                                style={{
                                                  padding: tokens.space.$3.val,
                                                  backgroundColor: theme.color4.val,
                                                  borderColor: theme.color5.val,
                                                  borderRadius: tokens.radius.$4.val,
                                                  borderTopRightRadius: 0,
                                                  borderBottomRightRadius: 0,
                                                }}
                                              />
                                            </YStack>
                                          )}
                                        />
                                      </Group.Item>
                                      <Group.Item>
                                        <form.AppField
                                          name={`tickets[${index}].currency`}
                                          children={(currencyField) => (
                                            <Select
                                              id={`ticket-currency-${ticket.id}`}
                                              value={currencyField.state.value || 'USDC'}
                                              onValueChange={(value) => {
                                                currencyField.handleChange(value as Cryptocurrency);
                                              }}
                                            >
                                              <Select.Trigger
                                                backgroundColor="$color4"
                                                borderColor="$color5"
                                                borderRadius="$4"
                                                borderTopLeftRadius={0}
                                                borderBottomLeftRadius={0}
                                                iconAfter={ChevronDown}
                                                width={120}
                                              >
                                                <Select.Value placeholder="USDC" />
                                              </Select.Trigger>

                                              <Select.Content zIndex={400_000}>
                                                <Select.ScrollUpButton />
                                                <Select.Viewport>
                                                  <Select.Item index={0} value="USDC">
                                                    <Select.ItemText>USDC</Select.ItemText>
                                                  </Select.Item>
                                                </Select.Viewport>
                                                <Select.ScrollDownButton />
                                              </Select.Content>
                                            </Select>
                                          )}
                                        />
                                      </Group.Item>
                                    </Group>
                                  </YStack>
                                )}

                                {/* Description */}
                                <form.AppField
                                  name={`tickets[${index}].description`}
                                  children={(descriptionField) => (
                                    <YStack gap="$1">
                                      <Label htmlFor={`ticket-description-${ticket.id}`}>
                                        Description
                                      </Label>
                                      <TextArea
                                        id={`ticket-description-${ticket.id}`}
                                        placeholder="What's included with this ticket?"
                                        value={descriptionField.state.value || ''}
                                        onChangeText={descriptionField.handleChange}
                                        backgroundColor="$color4"
                                        borderColor="$color5"
                                        borderRadius="$4"
                                        minHeight={80}
                                        style={
                                          {
                                            fieldSizing: 'content',
                                          } as any
                                        }
                                      />
                                    </YStack>
                                  )}
                                />

                                {/* Supply */}
                                <form.AppField
                                  name={`tickets[${index}].supply`}
                                  children={(supplyField) => (
                                    <YStack gap="$1">
                                      <Label htmlFor={`ticket-supply-${ticket.id}`}>
                                        Total Supply (Optional)
                                      </Label>
                                      <Input
                                        id={`ticket-supply-${ticket.id}`}
                                        placeholder="Leave empty for unlimited"
                                        value={supplyField.state.value?.toString() || ''}
                                        onChangeText={(text) => {
                                          const supply = parseInt(text, 10) || undefined;
                                          supplyField.handleChange(supply);
                                        }}
                                        keyboardType="number-pad"
                                        backgroundColor="$color4"
                                        borderColor="$color5"
                                        borderRadius="$4"
                                      />
                                    </YStack>
                                  )}
                                />
                              </YStack>
                            </Card>
                          );
                        })
                      )}

                      {/* Add Ticket Button */}
                      <Button
                        onPress={() =>
                          field.pushValue({
                            id: Date.now().toString(),
                            name: '',
                            description: '',
                            type: 'free',
                          })
                        }
                        backgroundColor="$color4"
                        borderColor="$color5"
                        borderWidth={1}
                        borderStyle="dashed"
                        py="$4"
                      >
                        <XStack alignItems="center" gap="$2">
                          <Plus size={16} />
                          <SizableText>Add Ticket Type</SizableText>
                        </XStack>
                      </Button>
                    </YStack>
                  );
                }}
              />
            </ScrollView>

            {/* Action Buttons */}
            <XStack
              gap="$3"
              p="$4"
              borderTopWidth={1}
              borderTopColor="$color4"
              backgroundColor="$color2"
            >
              <Button flex={1} theme="red" onPress={handleCancel}>
                Cancel
              </Button>
              <Button flex={1} themeInverse onPress={handleSave}>
                Save Tickets
              </Button>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    );
  },
}) as typeof EventTicketingSheet;
