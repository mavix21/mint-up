import { v } from 'convex/values';
import { query } from './_generated/server';

export const getRegistrationsByEventId = query({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('registrations')
      .filter((q) => q.eq(q.field('eventId'), args.eventId))
      .collect();
  },
});
