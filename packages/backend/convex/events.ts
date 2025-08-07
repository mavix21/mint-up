import { v } from 'convex/values';

import { query, QueryCtx } from './_generated/server';
import { mutation } from './_generated/server';
import { vv } from './schema';
import { omit } from 'convex-helpers';
import { Doc, Id } from './_generated/dataModel';

// Shared helper function to enrich events with common data
async function enrichEventsWithCommonData(
  ctx: QueryCtx,
  events: Doc<'events'>[],
  userId: Id<'users'> | null
) {
  // Get user registrations if userId is provided
  let userRegistrations: any[] = [];
  if (userId) {
    userRegistrations = await ctx.db
      .query('registrations')
      .withIndex('by_user_and_event', (q: any) => q.eq('userId', userId))
      .collect();
  }

  return Promise.all(
    events.map(async (event) => {
      const user = await ctx.db.get(event.creatorId);
      const imageUrl = (await ctx.storage.getUrl(event.image)) ?? null;

      // Get tickets for this event
      const tickets = await ctx.db
        .query('ticketTemplates')
        .withIndex('by_eventId', (q: any) => q.eq('eventId', event._id))
        .collect();

      const isHost = userId ? event.creatorId === userId : false;

      // Get user status if userId is provided
      let userStatus = null;
      if (userId && !isHost) {
        const registration = userRegistrations.find((reg) => reg.eventId === event._id);
        if (registration) {
          userStatus = registration.status.type;
        }
      }

      return {
        ...event,
        imageUrl,
        tickets,
        creator: {
          name: user?.displayName ?? 'Anonymous',
          imageUrl: user?.pfpUrl ?? null,
        },
        isHost,
        userStatus,
      };
    })
  );
}

export const getAllEvents = query({
  handler: async (ctx) => {
    const events = await ctx.db.query('events').order('desc').collect();
    return enrichEventsWithCommonData(ctx, events, null);
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
    return enrichEventsWithCommonData(ctx, events, null);
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
    return enrichEventsWithCommonData(ctx, events, null);
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
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity !== null ? (identity.subject as Id<'users'>) : null;

    let events: Doc<'events'>[];

    // Use search index for efficient full-text search with relevance ranking
    if (args.searchTerm && args.searchTerm.trim() !== '') {
      // Use search index with search expression and category filter
      if (args.category && args.category !== 'All') {
        events = await ctx.db
          .query('events')
          .withSearchIndex('search_events', (q) =>
            q.search('name', args.searchTerm!).eq('category', args.category as any)
          )
          .collect();
      } else {
        // Search without category filter
        events = await ctx.db
          .query('events')
          .withSearchIndex('search_events', (q) => q.search('name', args.searchTerm!))
          .collect();
      }
    } else {
      // No search term, just filter by category if specified
      let q = ctx.db.query('events');
      if (args.category && args.category !== 'All') {
        q = q.filter((q) => q.eq(q.field('category'), args.category));
      }
      events = await q.order('desc').collect();
    }

    return enrichEventsWithCommonData(ctx, events, userId);
  },
});

export const createEvent = mutation({
  args: {
    event: v.object(
      omit(vv.doc('events').fields, [
        '_id',
        '_creationTime',
        'creatorId',
        'registrationCount',
        'recentRegistrations',
      ])
    ),
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
      registrationCount: 0,
      recentRegistrations: [],
    });

    for (const ticket of args.tickets) {
      await ctx.db.insert('ticketTemplates', {
        ...ticket,
        eventId,
      });
    }

    // TODO: Agendar la action para hacer el trabajo pesado en segundo plano

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
    const allEvents = [...hostedEvents, ...registeredEvents.filter(Boolean)].filter(
      (event) => event !== null
    );

    // Enrich events with common data (including isHost and userStatus)
    return enrichEventsWithCommonData(ctx, allEvents, userId);
  },
});
