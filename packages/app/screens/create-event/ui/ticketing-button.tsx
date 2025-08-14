import { Ticket } from '@tamagui/lucide-icons';
import { TicketType } from 'app/entities';
import { Button, SizableText, Theme, ThemeName } from 'tamagui';

export interface TicketingButtonProps {
  tickets: TicketType[];
  onPress: () => void;
  theme?: ThemeName;
}

export function TicketingButton({ tickets, onPress, theme }: TicketingButtonProps) {
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

  const getTicketCount = () => {
    if (tickets.length === 0) {
      return '';
    }
    return ` (${tickets.length})`;
  };

  return (
    <Theme name={theme}>
      <Button
        justifyContent="flex-start"
        backgroundColor="$color3"
        icon={<Ticket color="$color11" size={16} />}
        onPress={onPress}
      >
        <SizableText flex={1} color="$color11">
          Tickets{getTicketCount()}
        </SizableText>
        <SizableText color="$color11" ml="$2">
          {getTicketText()}
        </SizableText>
      </Button>
    </Theme>
  );
}
