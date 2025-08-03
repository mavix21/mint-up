import { Doc } from '@my/backend/_generated/dataModel';

// Define the type for events returned by getUpcomingEvents
export type ConvexEventWithExtras = Doc<'events'> & {
  creatorName: string;
  imageUrl: string | null;
};
