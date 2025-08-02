import { v } from 'convex/values';
import { query } from './_generated/server';

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
