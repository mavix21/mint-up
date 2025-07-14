export interface Event {
  id: string;
  name: string;
  startTime: string;
  location: string;
  userRole: 'host' | 'attendee';
  nftTicketImageUrl?: string;
  poapImageUrl?: string | null;
  status?: string;
  stats?: EventStats;
}

export interface EventStats {
  mints?: number;
  capacity?: number | null;
  attendees?: number;
  poapsClaimed?: number;
}
