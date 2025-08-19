import { Doc } from '@my/backend/_generated/dataModel';

// Define the type for events returned by getUserEvents
export type ConvexEventWithExtras = Doc<'events'> & {
  creator: { name: string; imageUrl: string | null; username: string };
  imageUrl: string | null;
  tickets: Doc<'ticketTemplates'>[];
  isHost: boolean;
  userStatus?: 'pending' | 'minted' | 'rejected' | null;
};
