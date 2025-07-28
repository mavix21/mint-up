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
      .filter((q) => q.gte(q.field('startDate'), today))
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
      .filter((q) => q.lte(q.field('startDate'), today))
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
      .filter((q) => q.eq(q.field('_id'), args.eventId))
      .first();
    const imageUrl = (await ctx.storage.getUrl(event!.image)) ?? null;
    const user = await ctx.db.get(event!.creatorId);

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

export const createEvent = mutation({
  args: omit(vv.doc('events').fields, ['_id', '_creationTime', 'creatorId']),
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
      ...args,
      creatorId: user._id,
      hosts: [
        ...args.hosts,
        {
          userId: user._id,
          role: 'creator',
        },
      ],
    });

    return eventId;
  },
});
