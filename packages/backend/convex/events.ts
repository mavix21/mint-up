import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { vv } from './schema';
import { omit } from 'convex-helpers';
import { Id } from './_generated/dataModel';

export const getAllEvents = query({
  handler: async (ctx) => {
    const events = await ctx.db.query('events').order('desc').collect();
    return Promise.all(
      events.map(async (event) => {
        const user = await ctx.db.get(event.creatorId);
        const imageUrl = (await ctx.storage.getUrl(event.image)) ?? null;
        return {
          ...event,
          creatorName: user?.displayName ?? 'Anonymous',
          imageUrl,
        };
      })
    );
  },
});

export const getUpcomingEvents = query({
  handler: async (ctx) => {
    const today = Date.now();
    const events = await ctx.db
      .query('events')
      .withIndex('by_startDate', (q) => q.gt('startDate', today))
      .order('desc')
      .collect();
    return Promise.all(
      events.map(async (event) => {
        const user = await ctx.db.get(event.creatorId);
        const imageUrl = (await ctx.storage.getUrl(event.image)) ?? null;
        return {
          ...event,
          creatorName: user?.displayName ?? 'Anonymous',
          imageUrl,
        };
      })
    );
  },
});

export const getPastEvents = query({
  handler: async (ctx) => {
    const today = Date.now();
    const events = await ctx.db
      .query('events')
      .withIndex('by_startDate', (q) => q.lte('startDate', today))
      .order('desc')
      .collect();
    return Promise.all(
      events.map(async (event) => {
        const user = await ctx.db.get(event.creatorId);
        const imageUrl = (await ctx.storage.getUrl(event.image)) ?? null;
        return {
          ...event,
          creatorName: user?.displayName ?? 'Anonymous',
          imageUrl,
        };
      })
    );
  },
});

export const getEventById = query({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, args) => {
    //const events = await ctx.db.query('events').order('desc').collect();
    const event = await ctx.db
      .query('events')
      .withIndex('by_id', (q) => q.eq('_id', args.eventId))
      .first();

    if (!event) {
      return null;
    }

    const imageUrl = (await ctx.storage.getUrl(event.image)) ?? null;
    const user = await ctx.db.get(event.creatorId);

    return {
      ...event,
      creatorName: user?.displayName ?? 'Anonymous',
      imageUrl,
    };
  },
});

export const getEventsByCategory = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query('events');
    if (args.category && args.category !== 'All') {
      q = q.filter((q) => q.eq(q.field('category'), args.category));
    }
    const events = await q.order('desc').collect();
    return Promise.all(
      events.map(async (event) => {
        const user = await ctx.db.get(event.creatorId);
        const imageUrl = (await ctx.storage.getUrl(event.image)) ?? null;
        return {
          ...event,
          creatorName: user?.displayName ?? 'Anonymous',
          imageUrl,
        };
      })
    );
  },
});

export const getEventCategories = query({
  handler: async (ctx) => {
    const events = await ctx.db.query('events').collect();
    const categoriesSet = new Set(events.map((event) => event.category));
    return Array.from(categoriesSet);
  },
});

export const searchEvents = query({
  args: {
    searchTerm: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query('events');

    // Apply category filter if specified and not "All"
    if (args.category && args.category !== 'All') {
      q = q.filter((q) => q.eq(q.field('category'), args.category));
    }

    const events = await q.order('desc').collect();

    // Apply search filter in memory for better partial matching
    let filteredEvents = events;
    if (args.searchTerm && args.searchTerm.trim() !== '') {
      const searchTerm = args.searchTerm.toLowerCase().trim();
      filteredEvents = events.filter((event) => event.name.toLowerCase().includes(searchTerm));
    }

    return Promise.all(
      filteredEvents.map(async (event) => {
        const user = await ctx.db.get(event.creatorId);
        const imageUrl = (await ctx.storage.getUrl(event.image)) ?? null;
        const ticketList = await ctx.db.query('ticketTemplates').withIndex('by_eventId').collect();

        return {
          ...event,
          creatorName: user?.displayName ?? 'Anonymous',
          imageUrl,
          ticketList,
        };
      })
    );
  },
});

export const createEvent = mutation({
  args: {
    event: v.object(omit(vv.doc('events').fields, ['_id', '_creationTime', 'creatorId'])),
    tickets: v.array(
      v.object(omit(vv.doc('ticketTemplates').fields, ['_id', '_creationTime', 'eventId']))
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const user = await ctx.db.get(identity.subject as Id<'users'>);
    if (!user) {
      throw new Error('User not found');
    }
    const eventId = await ctx.db.insert('events', {
      ...args.event,
      creatorId: user._id,
      hosts: [
        ...args.event.hosts,
        {
          userId: user._id,
          role: 'creator',
        },
      ],
    });

    for (const ticket of args.tickets) {
      await ctx.db.insert('ticketTemplates', {
        ...ticket,
        eventId,
      });
    }

    return eventId;
  },
});

export const getUserEvents = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.subject as Id<'users'>;

    // Get events where user is creator/host
    const hostedEvents = await ctx.db
      .query('events')
      .withIndex('by_creatorId', (q) => q.eq('creatorId', userId))
      .collect();

    // Get events where user has registered
    const userRegistrations = await ctx.db
      .query('registrations')
      .withIndex('by_user_and_event', (q) => q.eq('userId', userId))
      .collect();

    const registeredEventIds = userRegistrations.map((reg) => reg.eventId);

    // Get registered events (excluding already fetched hosted events)
    const registeredEvents = await Promise.all(
      registeredEventIds
        .filter((eventId) => !hostedEvents.some((event) => event._id === eventId))
        .map(async (eventId) => {
          return await ctx.db.get(eventId);
        })
    );

    // Combine and deduplicate events
    const allEvents = [...hostedEvents, ...registeredEvents.filter(Boolean)];

    // Enrich events with creator info, image URLs, tickets, and user role/status
    return Promise.all(
      allEvents
        .filter((event): event is NonNullable<typeof event> => event !== null)
        .map(async (event) => {
          const user = await ctx.db.get(event.creatorId);
          const imageUrl = (await ctx.storage.getUrl(event.image)) ?? null;

          // Get tickets for this event
          const tickets = await ctx.db
            .query('ticketTemplates')
            .withIndex('by_eventId', (q) => q.eq('eventId', event._id))
            .collect();

          // Determine user role and status
          const isHost = event.creatorId === userId;
          let userStatus = null;

          if (!isHost) {
            const registration = userRegistrations.find((reg) => reg.eventId === event._id);
            if (registration) {
              userStatus = registration.status.type;
            }
          }

          return {
            ...event,
            creator: { name: user?.displayName ?? 'Anonymous', imageUrl: user?.pfpUrl ?? null },
            imageUrl,
            tickets,
            isHost,
            userStatus,
          } as const;
        })
    );
  },
});
