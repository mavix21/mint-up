import type { Id } from '@my/backend/_generated/dataModel';

import type { EventOwnershipType } from './constants';

/**
 * Event ownership configuration
 */
export interface EventOwnership {
  type: EventOwnershipType;
  organizationId?: Id<'organizations'>;
}

/**
 * Organization/Community summary for selection
 */
export interface OrganizationSummary {
  _id: Id<'organizations'>;
  name: string;
  description?: string;
  logoUrl?: Id<'_storage'>;
}
