export type AttendeeDirectoryStatus = 'locked' | 'unlocked';

export const ATTENDEE_DIRECTORY_MESSAGES = {
  locked: {
    title: 'Share Your Intentions to Unlock the Guest List',
    description:
      'Set your event goals to see who else is attending and discover meaningful connections.',
    ctaText: 'Add Your Intentions',
  },
  unlocked: {
    title: 'Event Attendees',
    emptyState: 'No attendees have shared their intentions yet.',
  },
} as const;
