import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const usersTable = defineTable({
  displayName: v.optional(v.string()),
  pfpUrl: v.optional(v.string()),
  bio: v.optional(v.string()),
  email: v.optional(v.string()),
  primaryWalletAddress: v.optional(v.string()),
})
  .index('by_primaryWalletAddress', ['primaryWalletAddress'])
  .index('by_email', ['email']);
