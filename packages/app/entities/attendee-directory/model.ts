import type { EventIntention } from '../event-intentions';

export interface AttendeeProfile {
  userId: string;
  name: string;
  avatar?: string;
  walletAddress?: string;
  worksAt?: string;
  role?: string[];
  intentions?: EventIntention[];
}

export interface AttendeeDirectoryData {
  attendees: AttendeeProfile[];
  totalCount: number;
  userHasIntentions: boolean;
}
