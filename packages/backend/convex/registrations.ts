import { v } from 'convex/values';
import { internalQuery, query } from './_generated/server';
import { mutation } from './_generated/server';
import { Id } from './_generated/dataModel';
import { internal } from './_generated/api';

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

export const get = internalQuery({
  args: { registrationId: v.id('registrations') },
  handler: async (ctx, args) => await ctx.db.get(args.registrationId),
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

// Get registration counts by status for a specific event (optimized for performance)
export const getRegistrationCountsByEventId = query({
  args: {
    eventId: v.id('events'),
  },
  returns: v.object({
    total: v.number(),
    pending: v.number(),
    approved: v.number(),
    rejected: v.number(),
    minted: v.number(),
  }),
  handler: async (ctx, args) => {
    // Use a single query with collect() to get all registrations for the event
    // This is more efficient than multiple separate queries
    const registrations = await ctx.db
      .query('registrations')
      .withIndex('by_event', (q) => q.eq('eventId', args.eventId))
      .collect();

    // Count by status using efficient array operations
    const counts = registrations.reduce(
      (acc, registration) => {
        acc.total++;

        switch (registration.status.type) {
          case 'pending':
            acc.pending++;
            break;
          case 'approved':
            acc.approved++;
            break;
          case 'rejected':
            acc.rejected++;
            break;
          case 'minted':
            acc.minted++;
            break;
          default:
            // Handle any unexpected status types
            break;
        }

        return acc;
      },
      { total: 0, pending: 0, approved: 0, rejected: 0, minted: 0 }
    );

    return counts;
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
    transactionReceipt: v.optional(
      v.object({
        walletAddress: v.string(),
        transactionHash: v.string(),
        tokenId: v.string(),
      })
    ),
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

    const reminderTime = event.startDate - 30 * 60 * 1000; // 30 minutos antes en milisegundos

    // Create new registration with pending status
    // The trigger will automatically update the event metadata
    const registrationId = await ctx.db.insert('registrations', {
      userId,
      eventId: args.eventId,
      ticketTemplateId: args.ticketTemplateId,
      status: ticketTemplate.isApprovalRequired
        ? { type: 'pending' }
        : args.transactionReceipt
        ? {
            type: 'minted',
            tokenId: args.transactionReceipt.tokenId,
            walletAddress: args.transactionReceipt.walletAddress,
            transactionHash: args.transactionReceipt.transactionHash,
            mintedAt: Date.now(),
          }
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
          status: ticketTemplate.isApprovalRequired
            ? { type: 'pending' as const }
            : args.transactionReceipt
            ? { type: 'minted' as const }
            : { type: 'approved' as const },
        },
      ].slice(-5),
    });

    // Solo programar si el evento es en el futuro
    if (reminderTime > Date.now()) {
      await ctx.scheduler.runAt(reminderTime, internal.events.sendReminderNotification, {
        registrationId: registrationId,
        eventId: args.eventId,
        userId: userId,
      });
      console.log(
        `Notificación programada para el evento ${args.eventId} a las ${new Date(
          reminderTime
        ).toLocaleString()}`
      );
    } else {
      console.log('El evento ya pasó o es en menos de 30 minutos. No se programará recordatorio.');
    }

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

export const getRegistrationTicketById = query({
  args: {
    registrationId: v.id('registrations'),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query('registrations')
      .withIndex('by_id', (q) => q.eq('_id', args.registrationId))
      .first();

    if (!registration) {
      return null;
    }

    const event = await ctx.db
      .query('events')
      .withIndex('by_id', (q) => q.eq('_id', registration.eventId))
      .first();

    if (!event) {
      return null;
    }

    const ticketTemplate = await ctx.db
      .query('ticketTemplates')
      .withIndex('by_eventId', (q) => q.eq('eventId', registration.eventId))
      .first();

    const holder = await ctx.db.get(registration.userId);
    const organizer = await ctx.db.get(event.hosts[0].userId);

    return {
      eventId: event._id,
      eventName: event.name,
      eventImageUrl: (await ctx.storage.getUrl(event.image)) ?? '',
      startDate: event.startDate,
      ticketName: ticketTemplate?.name,
      location: event.location.type === 'online' ? 'Virtual' : event.location.address,
      locationDetails:
        event.location.type === 'online' ? event.location.url : event.location.instructions,
      ticketHolder: {
        name: holder?.displayName ?? 'Anonymous',
        username: holder?.username ?? 'Anonymous',
        avatar: holder?.pfpUrl ?? '',
      },
      organizer: {
        name: organizer?.displayName ?? 'Anonymous',
        email: organizer?.email ?? 'Anonymous',
        avatar: organizer?.pfpUrl ?? '',
      },
      tokenId: registration.status.type === 'minted' ? registration.status.tokenId : '',
    };
  },
});

export const getRegistrationTicketByIdMetadata = query({
  args: {
    registrationId: v.id('registrations'),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query('registrations')
      .withIndex('by_id', (q) => q.eq('_id', args.registrationId))
      .first();

    if (!registration) {
      throw new Error('Registration not found');
    }

    const event = await ctx.db
      .query('events')
      .withIndex('by_id', (q) => q.eq('_id', registration.eventId))
      .first();

    if (!event) {
      throw new Error('Event not found');
    }

    const ticketTemplate = await ctx.db
      .query('ticketTemplates')
      .withIndex('by_eventId', (q) => q.eq('eventId', registration.eventId))
      .first();

    const holder = await ctx.db.get(registration.userId);
    const organizer = await ctx.db.get(event.hosts[0].userId);

    return {
      eventId: event._id,
      eventName: event.name,
      eventImageUrl: (await ctx.storage.getUrl(event.image)) ?? '',
      startDate: event.startDate,
      ticketName: ticketTemplate?.name,
      location: event.location.type === 'online' ? 'Virtual' : event.location.address,
      locationDetails:
        event.location.type === 'online' ? event.location.url : event.location.instructions,
      ticketHolder: {
        name: holder?.displayName ?? 'Anonymous',
        username: holder?.username ?? 'Anonymous',
        avatar: holder?.pfpUrl ?? '',
      },
      organizer: {
        name: organizer?.displayName ?? 'Anonymous',
        email: organizer?.email ?? 'Anonymous',
        avatar: organizer?.pfpUrl ?? '',
      },
      tokenId: registration.status.type === 'minted' ? registration.status.tokenId : '',
    };
  },
});

export const getRegistrationTicketByEventIdUserId = query({
  args: {
    eventId: v.id('events'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query('registrations')
      .withIndex('by_user_and_event', (q) =>
        q.eq('userId', args.userId).eq('eventId', args.eventId)
      )
      .first();

    if (!registration) {
      throw new Error('Registration not found');
    }

    const event = await ctx.db
      .query('events')
      .withIndex('by_id', (q) => q.eq('_id', registration.eventId))
      .first();

    if (!event) {
      throw new Error('Event not found');
    }

    const ticketTemplate = await ctx.db
      .query('ticketTemplates')
      .withIndex('by_eventId', (q) => q.eq('eventId', registration.eventId))
      .first();

    const holder = await ctx.db.get(registration.userId);
    const organizer = await ctx.db.get(event.hosts[0].userId);

    return {
      id: registration._id,
      eventId: event._id,
      eventName: event.name,
      eventImageUrl: (await ctx.storage.getUrl(event.image)) ?? '',
      startDate: event.startDate,
      ticketName: ticketTemplate?.name,
      location: event.location.type === 'online' ? 'Virtual' : event.location.address,
      locationDetails:
        event.location.type === 'online' ? event.location.url : event.location.instructions,
      ticketHolder: {
        name: holder?.displayName ?? 'Anonymous',
        username: holder?.username ?? 'Anonymous',
        avatar: holder?.pfpUrl ?? '',
      },
      organizer: {
        name: organizer?.displayName ?? 'Anonymous',
        email: organizer?.email ?? 'Anonymous',
        avatar: organizer?.pfpUrl ?? '',
      },
      tokenId: registration.status.type === 'minted' ? registration.status.tokenId : '',
    };
  },
});

export const approveRegistration = mutation({
  args: { registrationId: v.id('registrations') },
  handler: async (ctx, args) => {
    const registration = await ctx.db.get(args.registrationId);
    if (!registration) {
      throw new Error('Registration not found');
    }

    if (registration.status.type !== 'pending') {
      throw new Error('Registration is not pending');
    }

    await ctx.db.patch(args.registrationId, {
      status: { type: 'approved', approvedAt: Date.now() },
    });
  },
});

export const rejectRegistration = mutation({
  args: { registrationId: v.id('registrations') },
  handler: async (ctx, args) => {
    const registration = await ctx.db.get(args.registrationId);
    if (!registration) {
      throw new Error('Registration not found');
    }

    if (registration.status.type !== 'pending') {
      throw new Error('Registration is not pending');
    }

    await ctx.db.patch(args.registrationId, { status: { type: 'rejected' } });
  },
});
