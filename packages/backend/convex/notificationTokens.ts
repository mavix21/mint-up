import { v } from 'convex/values';
import { internalQuery } from './_generated/server';

export const get = internalQuery({
  args: { fid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('notificationTokens')
      .withIndex('by_fid', (q) => q.eq('fid', args.fid))
      .unique();
  },
});
