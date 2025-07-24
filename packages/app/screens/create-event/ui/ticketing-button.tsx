import { Ticket } from '@tamagui/lucide-icons';
import { Button, Text } from 'tamagui';

import { TicketType } from '../../../entities';

export interface TicketingButtonProps {
  tickets: TicketType[];
  onPress: () => void;
}

export function TicketingButton({ tickets, onPress }: TicketingButtonProps) {
  const getTicketText = () => {
    if (tickets.length === 0) {
      return 'Free';
    }

    const freeTickets = tickets.filter((t) => t.type === 'free');
    const paidTickets = tickets.filter((t) => t.type === 'paid');

    if (freeTickets.length > 0 && paidTickets.length === 0) {
      return 'Free';
    }

    if (freeTickets.length === 0 && paidTickets.length > 0) {
      const minPrice = Math.min(...paidTickets.map((t) => t.price || 0));
      return `From $${minPrice.toFixed(2)}`;
    }

    return 'Free & Paid';
  };

  const getTicketColor = () => {
    if (tickets.length === 0) {
      return '$color11';
    }
    return '$color12';
  };

  const getTicketCount = () => {
    if (tickets.length === 0) {
      return '';
    }
    return ` (${tickets.length})`;
  };

  return (
    <Button
      justifyContent="space-between"
      backgroundColor="$color3"
      iconAfter={<Ticket size={16} />}
      onPress={onPress}
    >
      <Text>Tickets{getTicketCount()}</Text>
      <Text color={getTicketColor()} ml="$2">
        {getTicketText()}
      </Text>
    </Button>
  );
}
