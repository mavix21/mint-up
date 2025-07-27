import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const usersTable = defineTable({
  displayName: v.optional(v.string()),
  username: v.optional(v.string()),
  pfpUrl: v.optional(v.string()),
  bio: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerified: v.optional(v.number()),
  primaryWalletAddress: v.optional(v.string()),
})
  .index('by_primaryWalletAddress', ['primaryWalletAddress'])
  .index('by_email', ['email']);
