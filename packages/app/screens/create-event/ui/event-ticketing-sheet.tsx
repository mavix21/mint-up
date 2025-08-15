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
  useVisualViewportHeight,
  NumberInput,
} from '@my/ui';
import { Plus, Trash2, ChevronDown } from '@tamagui/lucide-icons';
import type { Cryptocurrency, TicketType } from 'app/entities';
import { withForm } from 'app/shared/lib/form';
import { FieldInfo } from 'app/shared/ui/FieldInfo';
import { useState } from 'react';
import { StyleProp, TextStyle } from 'react-native';

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
    const visualViewportHeight = useVisualViewportHeight();
    const [initialTickets, setInitialTickets] = useState<TicketType[]>([]);
    const [ticketTypes, setTicketTypes] = useState<Record<string, TicketType['type']>>({});

    // Store initial state when sheet opens
    if (open && initialTickets.length === 0) {
      const currentTickets = form.state.values.tickets || [];
      setInitialTickets([...currentTickets]);
      // Initialize ticket types from current tickets
      const types: Record<string, TicketType['type']> = {};
      currentTickets.forEach((ticket) => {
        types[ticket.id] = ticket.type;
      });
      setTicketTypes(types);
    }

    // Reset initial state when sheet closes
    if (!open && initialTickets.length > 0) {
      setInitialTickets([]);
      setTicketTypes({});
    }

    const handleSave = () => {
      // Validate only the tickets field - this will validate the entire tickets array
      form.validateField('tickets', 'change');
      form.state.values.tickets.forEach((ticket, index) => {
        form.validateField(`tickets[${index}].name`, 'change');
        form.validateField(`tickets[${index}].description`, 'change');
        form.validateField(`tickets[${index}].price`, 'change');
      });

      const formErrors = form.state.errors[0] || {};
      const areTicketsValid = !Object.keys(formErrors).some((key) => key.startsWith('tickets'));
      // Check if tickets field has errors
      if (areTicketsValid) {
        onOpenChange(false);
      }
    };

    const handleCancel = () => {
      // Restore initial state
      form.setFieldValue('tickets', initialTickets);
      // Reset ticket types to initial state
      const types: Record<string, TicketType['type']> = {};
      initialTickets.forEach((ticket) => {
        types[ticket.id] = ticket.type;
      });
      setTicketTypes(types);
      onOpenChange(false);
    };

    const updateTicketType = (ticketId: string, newType: TicketType['type'], index: number) => {
      // Update local state immediately for UI reactivity
      setTicketTypes((prev) => ({ ...prev, [ticketId]: newType }));

      // Get current ticket from form
      const currentTicket = form.state.values.tickets[index];

      if (newType === 'paid') {
        // When switching to paid, ensure we have price and currency
        form.setFieldValue(`tickets[${index}]`, {
          id: currentTicket.id,
          name: currentTicket.name ?? '',
          description: currentTicket.description ?? '',
          supply: currentTicket.supply,
          type: 'paid',
          price: 0,
          currency: 'USDC',
        } as TicketType);
        form.validateField(`tickets[${index}].price`, 'change');
      } else {
        // When switching to free, remove price and currency
        form.setFieldValue(
          `tickets[${index}]`,
          {
            id: currentTicket.id,
            name: currentTicket.name ?? '',
            description: currentTicket.description ?? '',
            supply: currentTicket.supply,
            type: 'free',
          } as TicketType,
          { dontUpdateMeta: false }
        );
        form.validateField(`tickets[${index}].price`, 'change');
      }
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
                          const ticketType = ticketTypes[ticket.id] || 'free';

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
                                      <FieldInfo field={nameField} />
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

                                      updateTicketType(ticket.id, value, index);
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
                                    <form.AppField
                                      name={`tickets[${index}].price`}
                                      children={(priceField) => (
                                        <YStack gap="$1">
                                          <Label>Price & Currency</Label>
                                          <Group
                                            orientation="horizontal"
                                            separator={<Separator vertical />}
                                          >
                                            <Group.Item>
                                              <YStack flex={1}>
                                                <NumberInput
                                                  id={`ticket-price-${ticket.id}`}
                                                  placeholder="0.00"
                                                  value={priceField.state.value}
                                                  onChange={(e) => {
                                                    priceField.handleChange(e.target.valueAsNumber);
                                                  }}
                                                  min={0}
                                                  step={0.001}
                                                  style={{
                                                    borderTopRightRadius: 0,
                                                    borderBottomRightRadius: 0,
                                                  }}
                                                />
                                              </YStack>
                                            </Group.Item>
                                            <Group.Item>
                                              <form.AppField
                                                name={`tickets[${index}].currency`}
                                                children={(currencyField) => (
                                                  <Select
                                                    id={`ticket-currency-${ticket.id}`}
                                                    value={currencyField.state.value || 'USDC'}
                                                    onValueChange={(value) => {
                                                      currencyField.handleChange(
                                                        value as Cryptocurrency
                                                      );
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
                                          <FieldInfo field={priceField} />
                                        </YStack>
                                      )}
                                    />
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
                                          } as StyleProp<TextStyle>
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
                        onPress={() => {
                          const newTicketId = Date.now().toString();
                          field.pushValue({
                            id: newTicketId,
                            name: '',
                            description: '',
                            type: 'free',
                          });
                          // Initialize ticket type in local state
                          setTicketTypes((prev) => ({ ...prev, [newTicketId]: 'free' }));
                        }}
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
