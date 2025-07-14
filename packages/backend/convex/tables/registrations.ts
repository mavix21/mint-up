import { defineTable } from "convex/server";
import { v } from "convex/values";

export const registrationsTable = defineTable({
  userId: v.id("users"),
  eventId: v.id("events"),
  ticketTemplateId: v.string(),
  status: v.union(
    v.object({ type: v.literal("pending") }),
    v.object({ type: v.literal("rejected") }),
    v.object({
      type: v.literal("minted"),
      walletAddress: v.string(),
      transactionHash: v.string(),
      tokenId: v.number(),
      mintedAt: v.number(),
    }),
    v.object({
      type: v.literal("checkedIn"),
      checkedInAt: v.number(),
      poap: v.union(
        v.object({
          type: v.literal("claimed"),
          transactionHash: v.string(),
          tokenId: v.number(),
          mintedAt: v.number(),
        }),
        v.object({
          type: v.literal("not_claimed"),
        }),
      ),
    }),
  ),
});
