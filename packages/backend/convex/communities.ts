import { v } from 'convex/values';
import { query } from './_generated/server';
import type { Doc, Id } from './_generated/dataModel';
import { buildCommunityLeaderboard } from './lib/communityLeaderboard';

/**
 * Get all communities with basic stats
 */
export const getAllCommunities = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('organizations'),
      name: v.string(),
      description: v.optional(v.string()),
      logoUrl: v.union(v.string(), v.null()),
      memberCount: v.number(),
      eventCount: v.number(),
    })
  ),
  handler: async (ctx) => {
    const communities = await ctx.db.query('organizations').collect();

    return Promise.all(
      communities.map(async (community) => {
        // Get member count
        const memberships = await ctx.db
          .query('organizationMembers')
          .withIndex('by_organizationId', (q) => q.eq('organizationId', community._id))
          .collect();

        // Get event count
        const events = await ctx.db
          .query('events')
          .withIndex('by_organizationId', (q) => q.eq('organizationId', community._id))
          .collect();

        // Get logo URL
        const logoUrl = community.logoUrl ? await ctx.storage.getUrl(community.logoUrl) : null;

        return {
          _id: community._id,
          name: community.name,
          description: community.description,
          logoUrl,
          memberCount: memberships.length,
          eventCount: events.length,
        };
      })
    );
  },
});

/**
 * Get community profile with events and members
 */
export const getCommunityProfile = query({
  args: {
    communityId: v.string(),
  },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id('organizations'),
      name: v.string(),
      description: v.optional(v.string()),
      logoUrl: v.union(v.string(), v.null()),
      bannerUrl: v.null(),
      creator: v.object({
        _id: v.optional(v.id('users')),
        name: v.optional(v.string()),
      }),
      stats: v.object({
        members: v.number(),
        events: v.number(),
        activeStreak: v.number(),
      }),
      events: v.array(
        v.object({
          _id: v.id('events'),
          name: v.string(),
          description: v.optional(v.string()),
          startDate: v.number(),
          endDate: v.number(),
          location: v.any(),
          imageUrl: v.union(v.string(), v.null()),
          registrationCount: v.number(),
        })
      ),
      members: v.array(
        v.object({
          _id: v.id('users'),
          name: v.optional(v.string()),
          imageUrl: v.union(v.string(), v.null()),
          role: v.union(v.literal('admin'), v.literal('member')),
        })
      ),
      leaderboard: v.object({
        topAttendees: v.array(
          v.object({
            userId: v.id('users'),
            name: v.optional(v.string()),
            imageUrl: v.union(v.string(), v.null()),
            rank: v.number(),
            totalEventsAttended: v.number(),
          })
        ),
        attendanceStreak: v.array(
          v.object({
            userId: v.id('users'),
            name: v.optional(v.string()),
            imageUrl: v.union(v.string(), v.null()),
            rank: v.number(),
            streak: v.number(),
          })
        ),
      }),
    })
  ),
  handler: async (ctx, args) => {
    // Try to get the community by ID, but handle invalid IDs gracefully
    let community = null;
    try {
      community = await ctx.db.get(args.communityId as Id<'organizations'>);
    } catch (idError) {
      // If the ID is invalid, return null instead of throwing
      console.log('Invalid community ID provided:', args.communityId);
      return null;
    }

    if (!community) return null;

    // Get community creator info
    const creator = await ctx.db.get(community.creatorId);

    // Get all events for this community
    const events = await ctx.db
      .query('events')
      .withIndex('by_organizationId', (q) =>
        q.eq('organizationId', args.communityId as Id<'organizations'>)
      )
      .collect();

    const registrationsByEvent = new Map<Id<'events'>, Doc<'registrations'>[]>();

    // Get event details with additional info
    const eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        const imageUrl = event.image ? await ctx.storage.getUrl(event.image) : null;
        const eventRegistrations = await ctx.db
          .query('registrations')
          .withIndex('by_event', (q) => q.eq('eventId', event._id))
          .collect();

        registrationsByEvent.set(event._id, eventRegistrations);

        const registrationCount = eventRegistrations.filter(
          (registration) => registration.status.type !== 'rejected'
        ).length;

        return {
          _id: event._id,
          name: event.name,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          imageUrl,
          registrationCount,
        };
      })
    );

    // Get all members
    const memberships = await ctx.db
      .query('organizationMembers')
      .withIndex('by_organizationId', (q) =>
        q.eq('organizationId', args.communityId as Id<'organizations'>)
      )
      .collect();

    // Get member details
    const members = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db.get(membership.userId);
        if (!user) return null;

        return {
          _id: user._id,
          name: user.displayName,
          imageUrl: user.pfpUrl ?? null,
          role: membership.role,
        };
      })
    );

    const memberProfiles = members.filter(
      (member): member is NonNullable<typeof member> => member !== null
    );

    const leaderboard = buildCommunityLeaderboard({
      events: eventsWithDetails.map((event) => ({ _id: event._id, startDate: event.startDate })),
      registrationsByEvent,
      members: memberProfiles.map(({ _id, name, imageUrl }) => ({ _id, name, imageUrl })),
    });

    // Get community logo URL
    const logoUrl = community.logoUrl ? await ctx.storage.getUrl(community.logoUrl) : null;

    return {
      _id: community._id,
      name: community.name,
      description: community.description,
      logoUrl,
      bannerUrl: null, // TODO: Add banner to schema
      creator: {
        _id: creator?._id,
        name: creator?.displayName,
      },
      stats: {
        members: memberProfiles.length,
        events: events.length,
        activeStreak: leaderboard.attendanceStreak[0]?.streak ?? 0,
      },
      events: eventsWithDetails,
      members: memberProfiles,
      leaderboard,
    };
  },
});
