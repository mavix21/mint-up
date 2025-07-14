import { defineSchema } from "convex/server";

import { eventCommunicationsTable } from "./tables/eventCommunications";
import { eventsTable } from "./tables/events";
import { linkedAccountsTable } from "./tables/linkedAccounts";
import { organizationMembersTable } from "./tables/organizationMembers";
import { organizationsTable } from "./tables/organizations";
import { sessionsTable } from "./tables/sessions";
import { usersTable } from "./tables/user";

export default defineSchema({
  users: usersTable,
  linkedAccounts: linkedAccountsTable,
  sessions: sessionsTable,
  organizations: organizationsTable,
  organizationMembers: organizationMembersTable,
  events: eventsTable,
  eventCommunications: eventCommunicationsTable,
});
