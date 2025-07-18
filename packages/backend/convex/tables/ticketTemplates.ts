import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const ticketTemplatesTable = defineTable({
  eventId: v.id('events'),
  name: v.string(),
  description: v.optional(v.string()),
  totalSupply: v.optional(v.number()),
  isApprovalRequired: v.boolean(),
  price: v.union(
    v.object({ type: v.literal('free') }),
    v.object({ type: v.literal('paid'), amount: v.number(), currency: v.string() })
  ),
  nft: v.object({
    image: v.id('_storage'),
    metadata: v.optional(v.any()),
  }),
}).index('by_eventId', ['eventId']);
