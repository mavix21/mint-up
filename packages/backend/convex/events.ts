import { v } from 'convex/values';

import { internal } from './_generated/api';
import { action, internalAction, internalMutation, query, QueryCtx } from './_generated/server';
import { mutation } from './_generated/server';
import { vv } from './schema';
import { omit } from 'convex-helpers';
import { Doc, Id } from './_generated/dataModel';
import { baseSepolia } from 'viem/chains'; // Usa la red correcta

import { abi } from '../../app/shared/lib/abi';

import { privateKeyToAccount } from 'viem/accounts';
import { createPublicClient, createWalletClient, decodeEventLog, http } from 'viem';

// --- CONSTANTES ---
const CONTRACT_ADDRESS = process.env.MINTUP_FACTORY_CONTRACT_ADDRESS as `0x${string}`;

// --- HELPERS DE VIEM ---
// Creamos los clientes de Viem una sola vez para reutilizarlos.
const account = privateKeyToAccount(process.env.BACKEND_SIGNER_PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(process.env.BASE_SEPOLIA_RPC_URL),
});

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.BASE_SEPOLIA_RPC_URL),
});

// Shared helper function to enrich events with common data
async function enrichEventsWithCommonData(
  ctx: QueryCtx,
  events: Doc<'events'>[],
  userId: Id<'users'> | null
) {
  // Get user registrations if userId is provided
  let userRegistrations: any[] = [];
  if (userId) {
    userRegistrations = await ctx.db
      .query('registrations')
      .withIndex('by_user_and_event', (q: any) => q.eq('userId', userId))
      .collect();
  }

  return Promise.all(
    events.map(async (event) => {
      const user = await ctx.db.get(event.creatorId);
      const imageUrl = (await ctx.storage.getUrl(event.image)) ?? null;

      // Get tickets for this event
      const tickets = await ctx.db
        .query('ticketTemplates')
        .withIndex('by_eventId', (q: any) => q.eq('eventId', event._id))
        .collect();

      const isHost = userId ? event.creatorId === userId : false;

      // Get user status if userId is provided
      let userStatus = null;
      if (userId && !isHost) {
        const registration = userRegistrations.find((reg) => reg.eventId === event._id);
        if (registration) {
          userStatus = registration.status.type;
        }
      }

      return {
        ...event,
        imageUrl,
        tickets,
        creator: {
          name: user?.displayName ?? 'Anonymous',
          imageUrl: user?.pfpUrl ?? null,
        },
        isHost,
        userStatus,
      };
    })
  );
}

export const getAllEvents = query({
  handler: async (ctx) => {
    const events = await ctx.db.query('events').order('desc').collect();
    return enrichEventsWithCommonData(ctx, events, null);
  },
});

export const getUpcomingEvents = query({
  handler: async (ctx) => {
    const today = Date.now();
    const events = await ctx.db
      .query('events')
      .withIndex('by_startDate', (q) => q.gt('startDate', today))
      .order('desc')
      .collect();
    return enrichEventsWithCommonData(ctx, events, null);
  },
});

export const getPastEvents = query({
  handler: async (ctx) => {
    const today = Date.now();
    const events = await ctx.db
      .query('events')
      .withIndex('by_startDate', (q) => q.lte('startDate', today))
      .order('desc')
      .collect();
    return enrichEventsWithCommonData(ctx, events, null);
  },
});

export const getEventById = query({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, args) => {
    //const events = await ctx.db.query('events').order('desc').collect();
    const event = await ctx.db
      .query('events')
      .withIndex('by_id', (q) => q.eq('_id', args.eventId))
      .first();

    if (!event) {
      return null;
    }

    const imageUrl = (await ctx.storage.getUrl(event.image)) ?? null;
    const user = await ctx.db.get(event.creatorId);

    return {
      ...event,
      creatorName: user?.displayName ?? 'Anonymous',
      imageUrl,
    };
  },
});

export const getEventCategories = query({
  handler: async (ctx) => {
    const events = await ctx.db.query('events').collect();
    const categoriesSet = new Set(events.map((event) => event.category));
    return Array.from(categoriesSet);
  },
});

export const searchEvents = query({
  args: {
    searchTerm: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity !== null ? (identity.subject as Id<'users'>) : null;

    let events: Doc<'events'>[];

    // Use search index for efficient full-text search with relevance ranking
    if (args.searchTerm && args.searchTerm.trim() !== '') {
      // Use search index with search expression and category filter
      if (args.category && args.category !== 'All') {
        events = await ctx.db
          .query('events')
          .withSearchIndex('search_events', (q) =>
            q.search('name', args.searchTerm!).eq('category', args.category as any)
          )
          .collect();
      } else {
        // Search without category filter
        events = await ctx.db
          .query('events')
          .withSearchIndex('search_events', (q) => q.search('name', args.searchTerm!))
          .collect();
      }
    } else {
      // No search term, just filter by category if specified
      let q = ctx.db.query('events');
      if (args.category && args.category !== 'All') {
        q = q.filter((q) => q.eq(q.field('category'), args.category));
      }
      events = await q.order('desc').collect();
    }

    return enrichEventsWithCommonData(ctx, events, userId);
  },
});

export const createEvent = mutation({
  args: {
    event: v.object(
      omit(vv.doc('events').fields, [
        '_id',
        '_creationTime',
        'creatorId',
        'registrationCount',
        'recentRegistrations',
      ])
    ),
    tickets: v.array(
      v.object(omit(vv.doc('ticketTemplates').fields, ['_id', '_creationTime', 'eventId']))
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const user = await ctx.db.get(identity.subject as Id<'users'>);
    if (!user) {
      throw new Error('User not found');
    }
    const eventId = await ctx.db.insert('events', {
      ...args.event,
      creatorId: user._id,
      hosts: [
        ...args.event.hosts,
        {
          userId: user._id,
          role: 'creator',
        },
      ],
      registrationCount: 0,
      recentRegistrations: [],
    });

    const ticketTemplateIds = await Promise.all(
      args.tickets.map((ticket) =>
        ctx.db.insert('ticketTemplates', {
          ...ticket,
          eventId,
        })
      )
    );

    // TODO: Agendar la action para hacer el trabajo pesado en segundo plano
    await ctx.scheduler.runAfter(0, internal.events.createEventOnchain, {
      convexEventId: eventId,
      convexTicketTemplateIds: ticketTemplateIds,
      organizerAddress: user.currentWalletAddress ?? '',
      ticketsData: args.tickets,
    });

    return eventId;
  },
});

export const getUserEvents = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.subject as Id<'users'>;

    // Get events where user is creator/host
    const hostedEvents = await ctx.db
      .query('events')
      .withIndex('by_creatorId', (q) => q.eq('creatorId', userId))
      .collect();

    // Get events where user has registered
    const userRegistrations = await ctx.db
      .query('registrations')
      .withIndex('by_user_and_event', (q) => q.eq('userId', userId))
      .collect();

    const registeredEventIds = userRegistrations.map((reg) => reg.eventId);

    // Get registered events (excluding already fetched hosted events)
    const registeredEvents = await Promise.all(
      registeredEventIds
        .filter((eventId) => !hostedEvents.some((event) => event._id === eventId))
        .map(async (eventId) => {
          return await ctx.db.get(eventId);
        })
    );

    // Combine and deduplicate events
    const allEvents = [...hostedEvents, ...registeredEvents.filter(Boolean)].filter(
      (event) => event !== null
    );

    // Enrich events with common data (including isHost and userStatus)
    return enrichEventsWithCommonData(ctx, allEvents, userId);
  },
});

export const createEventOnchain = internalAction({
  args: {
    convexEventId: v.id('events'),
    convexTicketTemplateIds: v.array(v.id('ticketTemplates')),
    organizerAddress: v.string(),
    ticketsData: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    if (
      !process.env.BACKEND_SIGNER_PRIVATE_KEY ||
      !process.env.BASE_SEPOLIA_RPC_URL ||
      !CONTRACT_ADDRESS
    ) {
      throw new Error('Missing required environment variables for on-chain interaction.');
    }

    try {
      const ticketParams = args.ticketsData.map((t) => ({
        priceETH:
          t.price.type === 'paid' && t.price.currency === 'ETH' ? BigInt(t.price.amount) : 0n,
        priceUSDC:
          t.price.type === 'paid' && t.price.currency === 'USDC' ? BigInt(t.price.amount) : 0n,
        maxSupply: BigInt(t.totalSupply || 0),
        metadataURI: 'Agregar metadata del evento',
      }));

      console.log(`[Event: ${args.convexEventId}] Simulating contract call...`);
      const { request } = await publicClient.simulateContract({
        account,
        address: CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'createEventWithTickets',
        args: [args.organizerAddress as `0x${string}`, ticketParams],
      });

      console.log(`[Event: ${args.convexEventId}] Sending transaction...`);
      const txHash = await walletClient.writeContract(request);
      console.log(
        `[Event: ${args.convexEventId}] Transaction sent with hash: ${txHash}. Waiting for receipt...`
      );

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

      if (receipt.status === 'reverted') {
        throw new Error('Transaction reverted.');
      }

      let onchainEventId: string | null = null;
      for (const log of receipt.logs) {
        try {
          const decodedLog = decodeEventLog({ abi: abi, data: log.data, topics: log.topics });
          if (decodedLog.eventName === 'EventCreated') {
            onchainEventId = (decodedLog.args as any).eventId.toString();
            break;
          }
        } catch {
          throw new Error('Error inside trying read receipt.log');
        }
      }

      if (!onchainEventId) {
        throw new Error('Could not find EventCreated log in transaction receipt');
      }

      console.log(
        `[Event: ${args.convexEventId}] On-chain event created with ID: ${onchainEventId}.`
      );

      const ticketUpdates = args.convexTicketTemplateIds.map((templateId, index) => {
        const ticketIndex = BigInt(index);
        const tokenId = (BigInt(onchainEventId as string) << 128n) | ticketIndex;
        return {
          templateId: templateId,
          tokenId: tokenId.toString(),
        };
      });

      await ctx.runMutation(internal.events.finalizeOnchainSync, {
        convexEventId: args.convexEventId,
        onchainEventId: onchainEventId,
        contractAddress: CONTRACT_ADDRESS,
        chainId: baseSepolia.id,
        ticketUpdates,
      });

      console.log(`[Event: ${args.convexEventId}] Successfully synced on-chain data to Convex.`);
    } catch (error) {
      console.error(`[Event: ${args.convexEventId}] On-chain sync failed:`, error);
      throw error;
    }
  },
});

export const finalizeOnchainSync = internalMutation({
  args: {
    convexEventId: v.id('events'),
    onchainEventId: v.string(),
    contractAddress: v.string(),
    chainId: v.number(),
    ticketUpdates: v.array(
      v.object({
        templateId: v.id('ticketTemplates'),
        tokenId: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.convexEventId, {
      onchainData: {
        status: 'synced',
        eventId: args.onchainEventId,
        contractAddress: args.contractAddress,
        chainId: args.chainId,
      },
    });

    await Promise.all(
      args.ticketUpdates.map(async (update) => {
        const currentTemplate = await ctx.db.get(update.templateId);
        if (currentTemplate && currentTemplate.ticketType.type === 'onchain') {
          return ctx.db.patch(update.templateId, {
            ticketType: {
              ...currentTemplate.ticketType,
              syncStatus: {
                status: 'synced',
                tokenId: BigInt(update.tokenId),
                contractAddress: args.contractAddress,
                chainId: args.chainId,
              },
            },
          });
        }
      })
    );
  },
});
