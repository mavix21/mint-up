import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getEvents = query({
  handler: async (ctx) => {
    const events = await ctx.db.query("events").order("desc").collect();
    return Promise.all(
      events.map(async (event) => {
        const user = await ctx.db.get(event.creatorId);
        return {
          ...event,
          creatorName: user?.displayName ?? "Anonymous",
        };
      }),
    );
  },
});

export const createEvent = mutation({
  args: {
    name: v.string(),
    image: v.id("_storage"),
    description: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    creatorId: v.id("users"),
    organizationId: v.optional(v.id("organizations")),
    location: v.union(
      v.object({
        type: v.literal("online"),
        url: v.string(),
      }),
      v.object({
        type: v.literal("in-person"),
        address: v.string(),
        instructions: v.optional(v.string()),
      }),
    ),
    visibility: v.union(v.literal("public"), v.literal("unlisted")),
    hosts: v.array(
      v.object({
        userId: v.id("users"),
        role: v.string(),
      }),
    ),
    ticketTemplates: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        description: v.optional(v.string()),
        totalSupply: v.optional(v.number()),
        isApprovalRequired: v.boolean(),
        price: v.union(
          v.object({ type: v.literal("free") }),
          v.object({
            type: v.literal("paid"),
            currency: v.string(),
            amount: v.number(),
          }),
        ),
        nft: v.object({
          image: v.id("_storage"),
          metadata: v.optional(v.any()),
        }),
      }),
    ),
    poapTemplate: v.object({
      name: v.string(),
      description: v.optional(v.string()),
      nft: v.object({
        image: v.id("_storage"),
        metadata: v.optional(v.any()),
      }),
    }),
    automatedFlows: v.optional(
      v.array(
        v.object({
          type: v.union(
            v.literal("pre_event_reminder"),
            v.literal("event_start_announcement"),
            v.literal("post_event_poap_announcement"),
          ),
          isEnabled: v.boolean(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.db.insert("events", {
      ...args,
      ticketPurchases: [],
    });
    return eventId;
  },
});
