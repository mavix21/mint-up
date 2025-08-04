/* eslint-disable no-restricted-imports */
import {
  mutation as rawMutation,
  internalMutation as rawInternalMutation,
} from './_generated/server';
/* eslint-enable no-restricted-imports */
import { DataModel } from './_generated/dataModel';
import { Triggers } from 'convex-helpers/server/triggers';
import { customCtx, customMutation } from 'convex-helpers/server/customFunctions';
import { GenericMutationCtx } from 'convex/server';

// start using Triggers, with table types from schema.ts
const triggers = new Triggers<DataModel>();

// Helper function to update event registration metadata
async function updateEventRegistrationMetadata(ctx: any, eventId: string) {
  // Get all registrations for this event
  const registrations = await ctx.db
    .query('registrations')
    .filter((q: any) => q.eq(q.field('eventId'), eventId))
    .collect();

  // Get recent registrations (last 5) with user details
  const recentRegistrations = await Promise.all(
    registrations
      .slice(-5)
      .reverse()
      .map(async (registration: any) => {
        const user = await ctx.db.get(registration.userId);
        return {
          userId: registration.userId,
          pfpUrl: user?.pfpUrl ?? undefined,
          displayName: user?.displayName ?? 'Anonymous',
          registrationTime: registration._creationTime,
        };
      })
  );

  // Update the event with new metadata
  await ctx.db.patch(eventId, {
    registrationCount: registrations.length,
    recentRegistrations,
  });
}

// Register trigger for registrations table to automatically update event metadata
triggers.register('registrations', async (ctx, change) => {
  console.log('Registration changed:', change);

  // Get the eventId from the registration change
  const eventId = change.newDoc?.eventId || change.oldDoc?.eventId;

  if (eventId) {
    // Update the event's registration metadata
    await updateEventRegistrationMetadata(ctx, eventId);
  }
});

// create wrappers that replace the built-in `mutation` and `internalMutation`
// the wrappers override `ctx` so that `ctx.db.insert`, `ctx.db.patch`, etc. run registered trigger functions
export const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));
export const internalMutation = customMutation(rawInternalMutation, customCtx(triggers.wrapDB));
