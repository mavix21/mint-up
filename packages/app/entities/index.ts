export type EventLocationType = 'in-person' | 'virtual';

interface VirtualLocation {
  type: 'virtual';
  url: string;
}

interface InPersonLocation {
  type: 'in-person';
  address: string;
  instructions?: string;
}

export type EventLocation = VirtualLocation | InPersonLocation;

export type TicketPriceType = 'free' | 'paid';
export type Cryptocurrency = 'ETH' | 'USDC';

interface FreeTicket {
  type: 'free';
}

interface PaidTicket {
  type: 'paid';
  price: number;
  currency: Cryptocurrency;
}

export type TicketType = (FreeTicket | PaidTicket) & {
  id: string;
  name: string;
  description: string;
  supply?: number;
};
