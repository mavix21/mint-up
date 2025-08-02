import { useVisualViewportHeight } from '@my/ui';
import { Plus, X, Trash2, ChevronDown } from '@tamagui/lucide-icons';
import { useState } from 'react';
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
} from 'tamagui';

import type { Cryptocurrency, TicketType } from '../../../entities';

export interface EventTicketingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tickets: TicketType[];
  onTicketsChange: (tickets: TicketType[]) => void;
}

export function EventTicketingSheet({
  open,
  onOpenChange,
  tickets,
  onTicketsChange,
}: EventTicketingSheetProps) {
  const [localTickets, setLocalTickets] = useState<TicketType[]>(tickets);
  const visualViewportHeight = useVisualViewportHeight();

  const handleSave = () => {
    onTicketsChange(localTickets);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalTickets(tickets);
    onOpenChange(false);
  };

  // Reset local state when sheet opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalTickets(tickets);
    }
    onOpenChange(isOpen);
  };

  const addTicket = () => {
    const newTicket: TicketType = {
      id: Date.now().toString(),
      name: '',
      type: 'free',
      description: '',
    };
    setLocalTickets((prev) => [...prev, newTicket]);
  };

  const updateTicket = (id: string, updates: Partial<TicketType>) => {
    setLocalTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== id) return ticket;

        const updatedTicket = { ...ticket, ...updates } as TicketType;

        // Ensure the ticket has the correct structure for its type
        if (updatedTicket.type === 'free') {
          // For free tickets, ensure no price or currency properties
          return {
            id: updatedTicket.id,
            name: updatedTicket.name,
            type: 'free' as const,
            description: updatedTicket.description,
            supply: updatedTicket.supply,
          } as TicketType;
        }

        // For paid tickets, ensure price and currency are present
        return {
          id: updatedTicket.id,
          name: updatedTicket.name,
          type: 'paid' as const,
          description: updatedTicket.description,
          supply: updatedTicket.supply,
          price: updatedTicket.price ?? 0,
          currency: updatedTicket.currency ?? 'ETH',
        } as TicketType;
      })
    );
  };

  const removeTicket = (id: string) => {
    setLocalTickets((prev) => prev.filter((ticket) => ticket.id !== id));
  };

  const isFormValid = localTickets.every((ticket) => {
    const hasRequiredFields = ticket.name.trim() !== '';

    // For paid tickets, ensure price and currency are set
    if (ticket.type === 'paid') {
      return hasRequiredFields && ticket.price !== undefined && ticket.currency !== undefined;
    }

    return hasRequiredFields;
  });

  return (
    <Sheet
      open={open}
      onOpenChange={handleOpenChange}
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
            <Button size="$2" circular backgroundColor="transparent" onPress={handleCancel}>
              <X size={16} />
            </Button>
          </XStack>

          <Separator />

          {/* Content */}
          <ScrollView flex={1} px="$4" py="$3">
            <YStack gap="$4">
              {localTickets.length === 0 ? (
                <YStack alignItems="center" py="$8" gap="$3">
                  <Text fontSize="$4" color="$color10" textAlign="center">
                    No tickets created yet
                  </Text>
                  <Text fontSize="$3" color="$color9" textAlign="center">
                    Add your first ticket type to get started
                  </Text>
                </YStack>
              ) : (
                localTickets.map((ticket, index) => (
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
                        {localTickets.length > 1 && (
                          <Button
                            size="$2"
                            circular
                            theme="red"
                            onPress={() => removeTicket(ticket.id)}
                            icon={<Trash2 size={14} />}
                          />
                        )}
                      </XStack>

                      {/* Ticket Name */}
                      <YStack gap="$1">
                        <Label htmlFor={`ticket-name-${ticket.id}`}>Ticket Name</Label>
                        <Input
                          id={`ticket-name-${ticket.id}`}
                          placeholder="e.g., Early Bird, VIP, General Admission"
                          value={ticket.name}
                          onChangeText={(text) => updateTicket(ticket.id, { name: text })}
                          backgroundColor="$color4"
                          borderColor="$color5"
                          borderRadius="$4"
                        />
                      </YStack>

                      {/* Price Type */}
                      <YStack gap="$1">
                        <Label>Price Type</Label>
                        <ToggleGroup
                          type="single"
                          value={ticket.type}
                          borderRadius="$4"
                          orientation="horizontal"
                          size="$3"
                          onValueChange={(value: TicketType['type']) => {
                            if (!value) return;
                            if (value === 'paid') {
                              // When switching to paid, ensure we have price and currency
                              updateTicket(ticket.id, {
                                type: 'paid',
                                price: 0, // Default price
                                currency: 'ETH', // Default currency
                              });
                            } else {
                              // When switching to free, remove price and currency
                              updateTicket(ticket.id, {
                                type: 'free',
                              });
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
                      {ticket.type === 'paid' && (
                        <YStack gap="$1">
                          <Label>Price & Currency</Label>
                          <Group orientation="horizontal" separator={<Separator vertical />}>
                            <Group.Item>
                              <YStack flex={1}>
                                <Input
                                  id={`ticket-price-${ticket.id}`}
                                  placeholder="0.00"
                                  value={ticket.price?.toString() || ''}
                                  onChangeText={(text) => {
                                    const price = parseFloat(text) || undefined;
                                    updateTicket(ticket.id, { price });
                                  }}
                                  keyboardType="decimal-pad"
                                  backgroundColor="$color4"
                                  borderColor="$color5"
                                  borderRadius="$4"
                                  borderTopRightRadius={0}
                                  borderBottomRightRadius={0}
                                />
                              </YStack>
                            </Group.Item>
                            <Group.Item>
                              <Select
                                id={`ticket-currency-${ticket.id}`}
                                value={ticket.currency || 'ETH'}
                                onValueChange={(value) => {
                                  updateTicket(ticket.id, { currency: value as Cryptocurrency });
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
                                  <Select.Value placeholder="ETH" />
                                </Select.Trigger>

                                <Select.Content zIndex={400_000}>
                                  <Select.ScrollUpButton />
                                  <Select.Viewport>
                                    <Select.Item index={0} value="ETH">
                                      <Select.ItemText>ETH</Select.ItemText>
                                    </Select.Item>
                                    <Select.Item index={1} value="USDC">
                                      <Select.ItemText>USDC</Select.ItemText>
                                    </Select.Item>
                                  </Select.Viewport>
                                  <Select.ScrollDownButton />
                                </Select.Content>
                              </Select>
                            </Group.Item>
                          </Group>
                        </YStack>
                      )}

                      {/* Description */}
                      <YStack gap="$1">
                        <Label htmlFor={`ticket-description-${ticket.id}`}>Description</Label>
                        <TextArea
                          id={`ticket-description-${ticket.id}`}
                          placeholder="What's included with this ticket?"
                          value={ticket.description}
                          onChangeText={(text) => updateTicket(ticket.id, { description: text })}
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

                      {/* Supply */}
                      <YStack gap="$1">
                        <Label htmlFor={`ticket-supply-${ticket.id}`}>
                          Total Supply (Optional)
                        </Label>
                        <Input
                          id={`ticket-supply-${ticket.id}`}
                          placeholder="Leave empty for unlimited"
                          value={ticket.supply?.toString() || ''}
                          onChangeText={(text) => {
                            const supply = parseInt(text, 10) || undefined;
                            updateTicket(ticket.id, { supply });
                          }}
                          keyboardType="number-pad"
                          backgroundColor="$color4"
                          borderColor="$color5"
                          borderRadius="$4"
                        />
                      </YStack>
                    </YStack>
                  </Card>
                ))
              )}

              {/* Add Ticket Button */}
              <Button
                onPress={addTicket}
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
            <Button flex={1} themeInverse onPress={handleSave} disabled={!isFormValid}>
              Save Tickets
            </Button>
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
