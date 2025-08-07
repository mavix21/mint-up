import { omit } from 'convex-helpers';
import { mutation } from './_generated/server';
import { vv } from './schema';
import { ConvexError, v } from 'convex/values';

export const createUserByFid = mutation({
  args: {
    ...omit(vv.doc('users').fields, ['_id', '_creationTime']),
    currentWalletAddress: v.optional(v.string()),
    fid: v.number(),
  },
  handler: async (ctx, args) => {
    const linkedAccount = await ctx.db
      .query('linkedAccounts')
      .withIndex('by_farcaster_fid', (q) => q.eq('account.fid', args.fid))
      .unique();

    if (linkedAccount) {
      const user = await ctx.db.get(linkedAccount.userId);
      if (!user) {
        throw new ConvexError({
          message: 'User not found',
        });
      }
      await ctx.db.patch(linkedAccount.userId, {
        username: args.username,
        pfpUrl: args.pfpUrl,
        displayName: args.displayName,
        bio: args.bio,
        currentWalletAddress: args.currentWalletAddress,
      });
      await ctx.db.patch(linkedAccount._id, {
        linkedAt: Date.now(),
      });
      return linkedAccount.userId;
    }

    const userId = await ctx.db.insert('users', {
      username: args.username,
      pfpUrl: args.pfpUrl,
      displayName: args.displayName,
      bio: args.bio,
      currentWalletAddress: args.currentWalletAddress,
    });

    await ctx.db.insert('linkedAccounts', {
      account: { protocol: 'farcaster', fid: args.fid },
      userId,
      linkedAt: Date.now(),
    });

    return userId;
  },
});
