import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const usersTable = defineTable({
  username: v.string(),
  pfpUrl: v.string(),
  displayName: v.optional(v.string()),
  bio: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerified: v.optional(v.number()),
  currentWalletAddress: v.optional(v.string()),
})
  .index('by_currentWalletAddress', ['currentWalletAddress'])
  .index('by_email', ['email']);
