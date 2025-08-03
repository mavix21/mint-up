import { v } from 'convex/values';
import { query, mutation } from './_generated/server';
import { Id } from './_generated/dataModel';

export const getRegistrationsByEventId = query({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, args) => {
    const registrations = await ctx.db
      .query('registrations')
      .filter((q) => q.eq(q.field('eventId'), args.eventId))
      .take(5);

    return Promise.all(
      registrations.map(async (registration) => {
        const assistant = await ctx.db.get(registration.userId);
        return {
          ...registration,
          assistant,
        };
      })
    );
  },
});

export const getRegistrationsByEventIdCount = query({
  args: {
    eventId: v.id('events'),
  },
  returns: v.number(),
  handler: async (ctx, args) => {
    const count = await ctx.db
      .query('registrations')
      .filter((q) => q.eq(q.field('eventId'), args.eventId))
      .collect();
    return count.length;
  },
});

export const createRegistration = mutation({
  args: {
    eventId: v.id('events'),
    ticketTemplateId: v.id('ticketTemplates'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const userId = identity.subject as Id<'users'>;

    // Check if user is already registered for this event
    const existingRegistration = await ctx.db
      .query('registrations')
      .withIndex('by_user_and_event', (q) => q.eq('userId', userId).eq('eventId', args.eventId))
      .first();

    if (existingRegistration) {
      throw new Error('User is already registered for this event');
    }

    // Create new registration with pending status
    const registrationId = await ctx.db.insert('registrations', {
      userId,
      eventId: args.eventId,
      ticketTemplateId: args.ticketTemplateId,
      status: { type: 'pending' },
    });

    return registrationId;
  },
});
