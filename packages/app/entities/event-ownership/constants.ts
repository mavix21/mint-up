/**
 * Event ownership type - determines whether an event is created by an individual or a community/organization
 */
export const EVENT_OWNERSHIP_TYPES = ['individual', 'community'] as const;

export type EventOwnershipType = (typeof EVENT_OWNERSHIP_TYPES)[number];

/**
 * Display metadata for event ownership types
 */
export const EVENT_OWNERSHIP_METADATA: Record<
  EventOwnershipType,
  {
    label: string;
    description: string;
  }
> = {
  individual: {
    label: 'An Individual',
    description: 'Create this event as yourself',
  },
  community: {
    label: 'A Community',
    description: 'Create this event on behalf of a community you manage',
  },
};
