import { omit } from 'convex-helpers';
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from './_generated/server';
import { internal } from './_generated/api';
import { vv } from './schema';
import { ConvexError, v } from 'convex/values';
interface User {
  object: string;
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  custody_address: string;
  profile: {
    bio: {
      text: string;
    };
  };
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: {
    eth_addresses: string[];
    sol_addresses: string[];
  };
  active_status: string;
  power_badge: boolean;
}

interface BulkUsersResponse {
  users: User[];
}

export const insertUserByFid = mutation({
  args: {
    ...omit(vv.doc('users').fields, ['_id', '_creationTime']),
    currentWalletAddress: v.optional(v.string()),
    fid: v.number(),
    initializedAt: v.optional(v.number()),
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
      // await ctx.db.patch(linkedAccount.userId, {
      //   username: args.username,
      //   pfpUrl: args.pfpUrl,
      //   displayName: args.displayName,
      //   bio: args.bio,
      //   currentWalletAddress: args.currentWalletAddress,
      // });
      // await ctx.db.patch(linkedAccount._id, {
      //   linkedAt: Date.now(),
      // });
      return linkedAccount.userId;
    }

    const userId = await ctx.db.insert('users', {
      username: args.username,
      pfpUrl: args.pfpUrl,
      displayName: args.displayName,
      bio: args.bio,
      currentWalletAddress: args.currentWalletAddress,
      profileInitializedAt: args.initializedAt,
    });

    await ctx.db.insert('linkedAccounts', {
      account: {
        protocol: 'farcaster',
        fid: args.fid,
        username: args.username,
        pfpUrl: args.pfpUrl,
        displayName: args.displayName,
        bio: args.bio,
        lastSyncedAt: args.initializedAt,
      },
      userId,
      linkedAt: Date.now(),
    });

    return userId;
  },
});

export const getUserByFid = query({
  args: {
    fid: v.number(),
  },
  handler: async (ctx, args) => {
    const linkedAccount = await ctx.db
      .query('linkedAccounts')
      .withIndex('by_farcaster_fid', (q) => q.eq('account.fid', args.fid))
      .unique();

    if (!linkedAccount) {
      return null;
    }

    const user = await ctx.db.get(linkedAccount.userId);

    if (!user) {
      return null;
    }

    return {
      displayName: user.displayName,
      username: user.username,
      pfpUrl: user.pfpUrl,
      bio: user.bio,
      currentWalletAddress: user.currentWalletAddress,
      fid: args.fid,
      userId: user._id,
      linkedAt: linkedAccount.linkedAt,
    };
  },
});

export const getUserById = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Query para obtener un usuario por su ID de la tabla 'users'
export const get = internalQuery({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.id('users'),
    bio: v.optional(v.string()),
    displayName: v.optional(v.string()),
    username: v.optional(v.string()),
    pfpUrl: v.optional(v.string()),
    currentWalletAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updateFields } = args;

    // Check if user exists
    const existingUser = await ctx.db.get(userId);
    if (!existingUser) {
      throw new ConvexError({
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    // Filter out undefined values to avoid removing fields unintentionally
    const fieldsToUpdate = Object.fromEntries(
      Object.entries(updateFields).filter(([_, value]) => value !== undefined)
    );

    // Only proceed if there are fields to update
    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new ConvexError({
        message: 'No fields provided for update',
        code: 'NO_UPDATE_FIELDS',
      });
    }

    await ctx.db.patch(userId, fieldsToUpdate);
  },
});

/**
 * Updates user social media links
 */
export const updateUserSocials = mutation({
  args: {
    userId: v.id('users'),
    socials: v.object({
      x: v.optional(v.string()),
      linkedin: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { userId, socials } = args;

    // Check if user exists
    const existingUser = await ctx.db.get(userId);
    if (!existingUser) {
      throw new ConvexError({
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    // Validate URL formats if provided
    const urlRegex = /^https?:\/\/.+/;
    if (socials.x && !urlRegex.test(socials.x)) {
      throw new ConvexError({
        message: 'Invalid X (Twitter) URL format',
        code: 'INVALID_URL',
      });
    }

    if (socials.linkedin && !urlRegex.test(socials.linkedin)) {
      throw new ConvexError({
        message: 'Invalid LinkedIn URL format',
        code: 'INVALID_URL',
      });
    }

    await ctx.db.patch(userId, { socials });
  },
});

/**
 * Internal mutation to update user profile with Neynar data
 * This is specifically for syncing user information from Farcaster/Neynar
 */
export const updateUserProfileInternal = internalMutation({
  args: {
    userId: v.id('users'),
    bio: v.optional(v.string()),
    displayName: v.optional(v.string()),
    username: v.optional(v.string()),
    pfpUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updateFields } = args;

    // Check if user exists
    const existingUser = await ctx.db.get(userId);
    if (!existingUser) {
      throw new ConvexError({
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    // Filter out undefined values to avoid removing fields unintentionally
    const fieldsToUpdate = Object.fromEntries(
      Object.entries(updateFields).filter(([_, value]) => value !== undefined)
    );

    // Only proceed if there are fields to update
    if (Object.keys(fieldsToUpdate).length === 0) {
      console.warn(`No fields provided for update for user ${userId}`);
      return;
    }

    await ctx.db.patch(userId, fieldsToUpdate);
  },
});

/**
 * Public mutation to sync user information with Farcaster
 * This finds the user's FID and triggers the internal sync action
 */
export const syncWithFarcaster = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db.get(args.userId);
    if (!existingUser) {
      throw new ConvexError({
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    // Find the user's Farcaster linked account to get their FID
    const linkedAccount = await ctx.db
      .query('linkedAccounts')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('account.protocol'), 'farcaster'))
      .unique();

    if (!linkedAccount || linkedAccount.account.protocol !== 'farcaster') {
      throw new ConvexError({
        message: 'No Farcaster account linked to this user',
        code: 'NO_FARCASTER_ACCOUNT',
      });
    }

    // Schedule the internal action to sync with Farcaster
    await ctx.scheduler.runAfter(0, internal.users.syncUserInformationWithFarcaster, {
      userId: args.userId,
      fid: linkedAccount.account.fid,
    });
  },
});

export const syncUserInformationWithFarcaster = internalAction({
  args: {
    userId: v.id('users'),
    fid: v.number(),
  },
  handler: async (ctx, args) => {
    if (!process.env.NEYNAR_API_KEY) {
      throw new Error('Missing required environment variables for Neynar interaction.');
    }

    try {
      // Construct the correct API URL with FID parameter
      const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${args.fid}`;
      const options: RequestInit = {
        method: 'GET',
        headers: {
          'x-api-key': process.env.NEYNAR_API_KEY,
          'Content-Type': 'application/json',
        },
      };

      console.log(`Fetching Farcaster data for FID ${args.fid}...`);
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Neynar API error: ${response.status} ${response.statusText}`);
      }

      const data: BulkUsersResponse = await response.json();

      // Validate the response structure
      if (!data || !data.users || !Array.isArray(data.users) || data.users.length === 0) {
        console.warn(`No user data returned from Neynar for FID ${args.fid}`);
        throw new Error(`No user found for FID ${args.fid}`);
      }

      const neynarUser = data.users[0];

      // Validate that we have the user data
      if (!neynarUser) {
        throw new Error(`Invalid user data returned for FID ${args.fid}`);
      }

      // Extract user data with safe property access
      const updateData = {
        username: neynarUser.username || undefined,
        pfpUrl: neynarUser.pfp_url || undefined,
        displayName: neynarUser.display_name || undefined,
        bio: neynarUser.profile?.bio?.text || undefined,
      };

      // Filter out undefined values to only update fields that have data
      const fieldsToUpdate = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      ) as {
        username?: string;
        pfpUrl?: string;
        displayName?: string;
        bio?: string;
      };

      if (Object.keys(fieldsToUpdate).length === 0) {
        console.log(`No valid data to update for user ${args.userId}`);
        return;
      }

      // Use internal mutation to update user profile since this is an internalAction
      await ctx.runMutation(internal.users.updateUserProfileInternal, {
        userId: args.userId,
        ...fieldsToUpdate,
      });

      console.log(
        `Successfully synced user ${args.userId} with Farcaster data for FID ${args.fid}`
      );
    } catch (error) {
      console.error('Error syncing user information with Farcaster:', error);
      // Re-throw with more specific error message
      throw new Error(
        `Failed to sync user information with Farcaster: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },
});
