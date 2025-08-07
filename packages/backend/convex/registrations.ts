import { v } from 'convex/values';
import { query } from './_generated/server';
import { mutation } from './_generated/server';
import { Id } from './_generated/dataModel';

export const getRegistrationsByEventId = query({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, args) => {
    const registrations = await ctx.db
      .query('registrations')
      .withIndex('by_event', (q) => q.eq('eventId', args.eventId))
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
      .withIndex('by_event', (q) => q.eq('eventId', args.eventId))
      .collect();
    return count.length;
  },
});

// Get detailed registration data for a specific event (for modals/detail views)
export const getDetailedRegistrationsByEventId = query({
  args: {
    eventId: v.id('events'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50; // Default to 50 registrations

    const registrations = await ctx.db
      .query('registrations')
      .withIndex('by_event', (q) => q.eq('eventId', args.eventId))
      .order('desc')
      .take(limit);

    return Promise.all(
      registrations.map(async (registration) => {
        const user = await ctx.db.get(registration.userId);
        return {
          ...registration,
          user: {
            _id: user?._id,
            displayName: user?.displayName ?? 'Anonymous',
            pfpUrl: user?.pfpUrl ?? null,
          },
        };
      })
    );
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

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const ticketTemplate = await ctx.db.get(args.ticketTemplateId);
    if (!ticketTemplate) {
      throw new Error('Ticket template not found');
    }

    const userId = identity.subject as Id<'users'>;

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is already registered for this event
    const existingRegistration = await ctx.db
      .query('registrations')
      .withIndex('by_user_and_event', (q) => q.eq('userId', userId).eq('eventId', args.eventId))
      .first();

    if (existingRegistration) {
      throw new Error('User is already registered for this event');
    }

    // Create new registration with pending status
    // The trigger will automatically update the event metadata
    const registrationId = await ctx.db.insert('registrations', {
      userId,
      eventId: args.eventId,
      ticketTemplateId: args.ticketTemplateId,
      status: ticketTemplate.isApprovalRequired
        ? { type: 'pending' }
        : { type: 'approved', approvedAt: Date.now() },
    });

    if (ticketTemplate.isApprovalRequired) return registrationId;

    await ctx.db.patch(args.eventId, {
      registrationCount: event.registrationCount + 1,
      recentRegistrations: [
        ...event.recentRegistrations,
        {
          userId,
          displayName: user.username,
          pfpUrl: user.pfpUrl,
          registrationTime: Date.now(),
        },
      ].slice(-5),
    });

    return registrationId;
  },
});

export const deleteRegistration = mutation({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const userId = identity.subject as Id<'users'>;

    // Find and delete the registration
    const registration = await ctx.db
      .query('registrations')
      .withIndex('by_user_and_event', (q) => q.eq('userId', userId).eq('eventId', args.eventId))
      .first();

    if (!registration) {
      throw new Error('Registration not found');
    }

    if (registration.status.type === 'approved') {
      await ctx.db.patch(args.eventId, {
        registrationCount: event.registrationCount - 1,
        recentRegistrations: event.recentRegistrations.filter(
          (registration) => registration.userId !== userId
        ),
      });
    }

    // Delete the registration
    // The trigger will automatically update the event metadata
    await ctx.db.delete(registration._id);

    return registration._id;
  },
});
