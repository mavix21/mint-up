# Mint Up

Onchain event tooling for communities and curators. Mint Up combines a Farcaster mini-app, multi-platform React clients, a Convex backend, and Base network smart contracts to create, distribute, and mint NFT tickets with wallet-native UX.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Key Capabilities](#key-capabilities)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Domain Model](#domain-model)
- [Smart Contracts](#smart-contracts)
- [Notifications and Background Jobs](#notifications-and-background-jobs)
- [Testing and Quality](#testing-and-quality)
- [Deployment Notes](#deployment-notes)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

## Overview

Mint Up is an event discovery and ticketing platform that leans into Farcaster distribution and the Base L2. Organizers create events that can be promoted through a Farcaster mini-app, users register or mint onchain tickets priced in USDC, and hosts manage attendee flows from the same stack. Convex handles data storage and access control, while shared Tamagui components keep the native and web experiences aligned.

## Architecture

Mint Up is maintained as a Yarn 4 workspaces monorepo.

```
apps/
  expo/          # Expo + React Native app
  mini/          # Next.js Farcaster mini-app
  storybook/     # Web Storybook instance for shared UI
  storybook-rn/  # Native Storybook for device testing
packages/
  app/           # Shared screens, widgets, domain models
  backend/       # Convex backend (schema + functions)
  smart-contracts/ # Hardhat project for MintUpFactory
  ui/            # Tamagui design system and tokens
scripts/         # Tooling helpers
```

- Shared UI and feature logic lives in `packages/app`; both Expo and the mini-app import from here.
- Convex functions in `packages/backend/convex` expose queries and mutations to all clients.
- `packages/smart-contracts` contains the MintUpFactory ERC-1155 contract and deployment utilities.
- Automation tasks (Open Graph images, Farcaster notifications) are implemented in `apps/mini` API routes.

## Key Capabilities

- **Event lifecycle management**: create events, configure ticket templates (free, paid, approval flows), and update schedules or locations.
- **Hybrid ticketing**: support off-chain RSVPs and onchain ERC-1155 tickets with USDC payments on Base/Base Sepolia.
- **Farcaster-native growth**: users authenticate with Farcaster, frames auto-register, and mini-app embeds integrate with Neynar and OnchainKit.
- **Attendee experience**: search, filter, and timeline views for upcoming events; personalized status, host tools, and shareable ticket art.
- **Notifications**: store frame push tokens, send targeted updates, and optionally use Upstash Redis for rate-limit friendly delivery.
- **Media automation**: dynamic Open Graph ticket images rendered via `@vercel/og` for registrations and shareable pages.
- **Cross-platform UI**: Tamagui-powered components shared across web, mini-app, and native clients with Storybook coverage.
- **Smart contract tooling**: Hardhat setup for MintUpFactory deployment, ABI publishing, and chain alignment with backend services.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), Expo SDK 52, React 19, Tamagui, Wagmi/Viem, Coinbase OnchainKit, NextAuth.
- **Backend**: Convex (functions, storage, scheduled actions), Neynar API, Upstash Redis (optional).
- **Blockchain**: Base L2 (and Base Sepolia for dev), ERC-1155 `MintUpFactory`, USDC integration, Pinata/IPFS for metadata.
- **Tooling**: Yarn 4 workspaces, Turbo, TypeScript 5.8, Hardhat 3, Storybook, EAS for native builds, Chromatic for visual diffing.

## Prerequisites

- Node.js 20.11+ (Next.js 15 and Expo SDK 52 both target Node 20 LTS).
- Yarn 4 (`corepack enable` recommended).
- Convex CLI (`npm install -g convex`), authenticated with your Convex project.
- Hardhat CLI (installed via `yarn` in `packages/smart-contracts`).
- Xcode 16.2+ and CocoaPods 1.14.x for iOS builds; Android Studio Hedgehog or newer for Android builds.
- `gh` CLI if you plan to use GitHub release tooling (optional).

## Initial Setup

1. Clone the repository and install dependencies:
   ```bash
   yarn install
   ```
2. Copy environment templates and fill in secrets:
   ```bash
   cp .env.example .env
   cp apps/mini/.env apps/mini/.env.local   # keep secrets out of version control
   ```
3. Authenticate tooling:
   - `convex dev` will prompt you to log in the first time.
   - `npx hardhat` inside `packages/smart-contracts` ensures node modules build.
   - Log into Expo and EAS if you plan to run native builds.
4. Deploy contracts (dev): use Base Sepolia RPC and deploy MintUpFactory, capture the contract address, and update backend env vars.
5. Seed initial data (optional): use Convex dashboard or write scripts against `packages/backend/convex` mutations.

## Environment Variables

The project relies on a single `.env` at the repo root. Per-app overrides can live in `apps/*/.env.local`.

### Core

| Name                   | Description                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_URL`      | Public base URL for the mini-app and notifications (e.g. `http://localhost:3000`).               |
| `EXPO_PUBLIC_URL`      | Base URL used by the Expo client to talk to the Next.js API (set to your LAN IP in simulators).  |
| `ENV`                  | `development` (Base Sepolia) or `production` (Base mainnet); drives blockchain client selection. |
| `NEXT_PUBLIC_APP_ICON` | Absolute URL to the app icon used in frame metadata and minted tickets.                          |

### Convex Backend

| Name                         | Description                                                                |
| ---------------------------- | -------------------------------------------------------------------------- |
| `CONVEX_SITE_URL`            | Convex deployment site URL (`https://<deployment>.convex.site`).           |
| `CONVEX_AUTH_PRIVATE_KEY`    | PEM private key used to mint Convex access tokens for the mini-app.        |
| `CONVEX_AUTH_ADAPTER_SECRET` | Shared secret for the Convex auth adapter route.                           |
| `JWKS`                       | JSON Web Key Set served by Convex for JWT validation (paste literal JSON). |
| `NEYNAR_API_KEY`             | Neynar key used to hydrate Farcaster profiles server-side.                 |

### Next.js Mini-App & Frames

| Name                                                             | Description                                                                                  |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_CONVEX_URL`                                         | Convex deployment URL consumed by the Convex React client.                                   |
| `NEXTAUTH_URL`                                                   | Absolute URL where NextAuth is reachable (must include protocol).                            |
| `NEXTAUTH_SECRET`                                                | Secret for JWT session encryption.                                                           |
| `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME`                            | Project identifier for Coinbase OnchainKit Mini integration.                                 |
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY`                                 | API key for OnchainKit frame actions.                                                        |
| `PINATA_JWT`                                                     | Pinata JWT for uploading ticket metadata.                                                    |
| `NEXT_PUBLIC_GATEWAY_URL`                                        | IPFS gateway hostname (no protocol) used when serving metadata.                              |
| `REDIS_URL` / `REDIS_TOKEN`                                      | Upstash Redis credentials for notification token storage (optional; fallbacks to in-memory). |
| `FARCASTER_HEADER` / `FARCASTER_PAYLOAD` / `FARCASTER_SIGNATURE` | Optional pre-baked frame payloads when testing locally.                                      |

### Blockchain Integration

| Name                              | Description                                                               |
| --------------------------------- | ------------------------------------------------------------------------- |
| `BASE_RPC_URL`                    | HTTPS RPC endpoint for Base (or Base Sepolia).                            |
| `BACKEND_SIGNER_PRIVATE_KEY`      | Server-side wallet used to orchestrate onchain ticket deployments.        |
| `MINTUP_FACTORY_CONTRACT_ADDRESS` | Deployed MintUpFactory address (must align with chain selected by `ENV`). |

### Expo App

| Name                 | Description                                                                       |
| -------------------- | --------------------------------------------------------------------------------- |
| `GOOGLE_*` variables | Google OAuth credentials for native sign-in flows (optional if not using Google). |

### Optional Metadata Fields

`NEXT_PUBLIC_APP_SUBTITLE`, `NEXT_PUBLIC_APP_DESCRIPTION`, `NEXT_PUBLIC_APP_SPLASH_IMAGE`, `NEXT_PUBLIC_APP_PRIMARY_CATEGORY`, `NEXT_PUBLIC_APP_TAGLINE`, `NEXT_PUBLIC_APP_OG_*` let you tune frame cards without touching code.

The root `environment.d.ts` file tracks expected variables; update it if you introduce new ones so TypeScript surfaces missing configuration early.

## Running the Project

Run services in separate terminals for the best DX.

### Convex backend

```bash
cd packages/backend
yarn dev
```

This starts Convex local dev (hot reload). The CLI outputs the local deployment URL; ensure `NEXT_PUBLIC_CONVEX_URL` matches.

### Farcaster mini-app (Next.js)

```bash
cd apps/mini
yarn dev
```

- Requires Convex dev server.
- If you are testing in the Farcaster client, expose the dev server with `ngrok` or `cloudflared` and update `NEXTAUTH_URL`/`NEXT_PUBLIC_URL`.

### Expo app

```bash
yarn native
```

- Pick the platform in Expo CLI (`i` for iOS simulator, `a` for Android).
- Ensure `EXPO_PUBLIC_URL` points to your machine IP so the native app can reach Next.js or Convex endpoints.

### Storybook

- Web: `yarn storybook:web`
- Native: `yarn storybook:native`

Both commands build the shared packages before launching the Storybook instance.

### Smart contracts

```bash
cd packages/smart-contracts
yarn compile
yarn test
```

Use `yarn deploy --network baseSepolia` (configure `hardhat.config.ts`) to push to your dev network. Export the resulting address into `.env`.

### Turbo pipelines

The root `yarn watch` runs type and package builds in parallel, useful when iterating on shared components.

## Domain Model

Convex tables and key relationships:

- `users`: Farcaster-linked identities, wallet addresses, and profile metadata.
- `linkedAccounts`: external account links (Farcaster FID, wallets) for identity resolution.
- `events`: core event data (host, schedule, visibility, theme, storage-backed image).
- `ticketTemplates`: definitions for each ticket tier, including onchain/offchain properties.
- `registrations`: attendee records with status (`pending`, `minted`, `rejected`).
- `notificationTokens`: Farcaster mini-app frame tokens for push notifications.
- `eventCommunications` / `organizations`: scaffolding for organizer tooling.
- `_storage`: files uploaded via Convex storage (images, attachments).

See `packages/backend/convex/schema.ts` and the `tables/` directory for field-level definitions and indexes.

## Smart Contracts

- `MintUpFactoryV1` (ERC-1155) mints ticket collections per event. Token IDs encode event ID (upper 128 bits) and ticket tier (lower 128 bits).
- Prices are denominated in USDC (6 decimals). `SafeERC20` handles transfers to organizers.
- `createEventWithTickets` is called from Convex to register new ticket templates; `mintTicket` is available to buyers.
- `packages/app/shared/lib/abi.ts` exposes the ABI for front-end clients, while Convex orchestrates wallet actions through Viem.
- Update `packages/app/shared/lib/constants.ts` if you change contract addresses for dev/prod or support additional chains.

## Notifications and Background Jobs

- `apps/mini/contexts/mini-app.context.tsx` leverages Coinbase OnchainKit to request frame permissions and stores notification tokens via Convex.
- `apps/mini/lib/notification-client.ts` posts MiniApp notifications. Provide `REDIS_URL`/`REDIS_TOKEN` (Upstash) to persist tokens across deploys; otherwise tokens exist only in Convex.
- Convex scheduled functions in `events.ts` can push updates to attendees (e.g., minted status) and ping registered tokens.

## Testing and Quality

- Type checking: `yarn check:type` (root) or `yarn workspace mini run check:type`.
- Linting: `yarn lint` (runs Turbo across workspaces), `yarn lint:fix` for autofix.
- Storybook visual coverage: `yarn chromatic` after setting your Chromatic project token.
- Contract tests: `yarn workspace smart-contracts test` (Hardhat + Forge assertions).
- CI builds: `yarn build:ci` focuses on the mini-app for deployment pipelines.

## Deployment Notes

- **Mini-app (Next.js)**: Deploy `apps/mini` to Vercel or a Node host. Configure environment variables in the hosting platform and add your production URL to Farcaster frame settings. Make sure `NEXTAUTH_URL` matches the deployed domain.
- **Convex**: `yarn deploy` inside `packages/backend` pushes schema and functions to your Convex production deployment. Update `NEXT_PUBLIC_CONVEX_URL`/`CONVEX_SITE_URL` to the production endpoints.
- **Expo**: Use EAS builds (`apps/expo/eas.json` already scaffolds env slots). Update `owner`, `projectId`, and verify any API endpoints point to production services.
- **Smart contracts**: Deploy MintUpFactory to Base mainnet (or the chain of choice). Update `.env` with the new address and redeploy backend so contract interactions point to the correct chain.

## Troubleshooting

- **Frames returning 401**: Verify `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and Farcaster signer payloads. Re-run Convex dev after updating envs.
- **Onchain creation stuck at pending**: ensure `BACKEND_SIGNER_PRIVATE_KEY`, `BASE_RPC_URL`, and `MINTUP_FACTORY_CONTRACT_ADDRESS` are set. Check Convex logs for `events.createEventOnchain`.
- **Mini-app cannot fetch Convex**: `NEXT_PUBLIC_CONVEX_URL` must match the deployment you started. Local dev uses the CLI-provided URL (usually `https://<id>.convex.cloud`).
- **Expo network errors**: set `EXPO_PUBLIC_URL` to your LAN IP (run `yarn get-local-ip-mac`) so the device can reach the Next.js server.

## Additional Resources

- Convex docs: https://docs.convex.dev
- Coinbase OnchainKit Mini: https://onchainkit.xyz/docs/mini-apps
- Farcaster Neynar API: https://docs.neynar.com
- Base network developer portal: https://docs.base.org
- Tamagui design system: https://tamagui.dev
