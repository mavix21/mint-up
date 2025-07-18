import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const eventsTable = defineTable({
  name: v.string(),
  image: v.id('_storage'),
  description: v.optional(v.string()),
  startDate: v.number(),
  endDate: v.optional(v.number()),
  creatorId: v.id('users'),
  organizationId: v.optional(v.id('organizations')),
  location: v.union(
    v.object({
      type: v.literal('online'),
      url: v.string(),
    }),
    v.object({
      type: v.literal('in-person'),
      address: v.string(),
      instructions: v.optional(v.string()),
    })
  ),
  visibility: v.union(v.literal('public'), v.literal('unlisted')),
  hosts: v.array(
    v.object({
      userId: v.id('users'),
      role: v.union(v.string()),
    })
  ),

  automatedFlows: v.optional(
    v.array(
      v.object({
        type: v.union(
          v.literal('pre_event_reminder'),
          v.literal('event_start_announcement'),
          v.literal('post_event_poap_announcement')
        ),
        isEnabled: v.boolean(),
      })
    )
  ),
})
  .index('by_creatorId', ['creatorId'])
  .index('by_organizationId', ['organizationId']);
