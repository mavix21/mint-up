import type { EventIntention } from './constants';

/**
 * Represents a user's event-specific intentions.
 * This is stored per registration to track what a user hopes to achieve at a specific event.
 */
export interface EventIntentionsData {
  intentions: EventIntention[];
  updatedAt?: number;
}

/**
 * Validation helper to check if a value is a valid event intention
 */
export function isValidEventIntention(value: string): value is EventIntention {
  return [
    'Networking',
    'Hiring Talent',
    'Seeking Investment',
    'Exploring Opportunities',
    'Learning',
  ].includes(value);
}

/**
 * Validation helper to check if all values in an array are valid event intentions
 */
export function areValidEventIntentions(values: string[]): values is EventIntention[] {
  return values.every(isValidEventIntention);
}
