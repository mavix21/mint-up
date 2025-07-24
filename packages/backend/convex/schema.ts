import { defineSchema } from 'convex/server';

import { eventCommunicationsTable } from './tables/eventCommunications';
import { eventsTable } from './tables/events';
import { linkedAccountsTable } from './tables/linkedAccounts';
import { organizationMembersTable } from './tables/organizationMembers';
import { organizationsTable } from './tables/organizations';
import { sessionsTable } from './tables/sessions';
import { usersTable } from './tables/user';
import { ticketTemplatesTable } from './tables/ticketTemplates';
import { registrationsTable } from './tables/registrations';
import { poapTemplatesTable } from './tables/poapTemplates';
import { typedV } from 'convex-helpers/validators';

const schema = defineSchema({
  users: usersTable,
  linkedAccounts: linkedAccountsTable,
  sessions: sessionsTable,
  organizations: organizationsTable,
  organizationMembers: organizationMembersTable,
  events: eventsTable,
  eventCommunications: eventCommunicationsTable,
  ticketTemplates: ticketTemplatesTable,
  poapTemplates: poapTemplatesTable,
  registrations: registrationsTable,
});

export default schema;

export const vv = typedV(schema);
