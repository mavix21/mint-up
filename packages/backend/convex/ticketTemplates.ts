import { v } from 'convex/values';
import { query } from './_generated/server';

export const getTicketsById = query({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, args) => {
    const ticketTemplates = await ctx.db
      .query('ticketTemplates')
      .filter((q) => q.eq(q.field('eventId'), args.eventId))
      .collect();

    return ticketTemplates;
  },
});
