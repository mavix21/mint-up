import { createAppClient, viemConnector } from '@farcaster/auth-client';
import { Id } from '@my/backend/_generated/dataModel';
import { SignJWT, importPKCS8 } from 'jose';
import type { AuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { parseSiweMessage } from 'viem/siwe';

import { getNeynarUser } from './lib/neynar';
import { getUserByFid } from './src/users/get-user-by-id';
import { insertUserByFid } from './src/users/insert-user-by-fid.action';

declare module 'next-auth' {
  interface Session {
    convexToken: string;
    user: {
      id: Id<'users'>;
      fid: number;
      username: string;
      image: string;
      currentWalletAddress: `0x${string}`;
    };
  }

  interface User {
    id: Id<'users'>;
    fid: number;
    username: string;
    image: string;
    currentWalletAddress: `0x${string}`;
  }

  interface JWT {
    user: {
      id: Id<'users'>;
      fid: number;
      username: string;
      image: string;
      currentWalletAddress: `0x${string}`;
    };
  }
}

const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL!.replace(/.cloud$/, '.site');

function getDomainFromUrl(urlString: string | undefined): string {
  if (!urlString) {
    console.warn('NEXTAUTH_URL is not set, using localhost:3000 as fallback');
    return 'localhost:3000';
  }
  try {
    const url = new URL(urlString);
    return url.host;
  } catch (error) {
    console.error('Invalid NEXTAUTH_URL:', urlString, error);
    console.warn('Using localhost:3000 as fallback');
    return 'localhost:3000';
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Sign in with Farcaster',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
        // In a production app with a server, these should be fetched from
        // your Farcaster data indexer rather than have them accepted as part
        // of credentials.
        // question: should these natively use the Neynar API?
        name: {
          label: 'Name',
          type: 'text',
          placeholder: '0x0',
        },
        pfp: {
          label: 'Pfp',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials, req) {
        const csrfToken = req?.body?.csrfToken;
        if (!csrfToken) {
          console.error('CSRF token is missing from request');
          return null;
        }
        const message = credentials?.message;
        if (!message) {
          console.error('Message is missing from request');
          return null;
        }
        const { address } = parseSiweMessage(message);

        const appClient = createAppClient({
          ethereum: viemConnector(),
        });

        const domain = getDomainFromUrl(process.env.NEXTAUTH_URL);

        const verifyResponse = await appClient.verifySignInMessage({
          message,
          signature: credentials?.signature as `0x${string}`,
          domain,
          nonce: csrfToken,
        });
        const { success, fid, error } = verifyResponse;

        if (!success) {
          console.error('Failed to verify sign in message', {
            error,
          });
          return null;
        }

        try {
          const existingUser = await getUserByFid(fid);

          // If user exists, return existing data
          if (existingUser) {
            console.warn('User already linked, returning existing data', { fid });
            return {
              id: existingUser.userId,
              fid,
              name: existingUser.username,
              username: existingUser.username,
              image: existingUser.pfpUrl,
              currentWalletAddress:
                existingUser.currentWalletAddress !== undefined
                  ? (existingUser.currentWalletAddress as `0x${string}`)
                  : address ?? '0x0',
            };
          }

          // Fetch fresh data from Neynar ONLY FOR NEW USERS
          const neynarUser = await getNeynarUser(fid);
          if (!neynarUser) {
            console.error('Failed to get Neynar user', { fid });
          }

          const userData = {
            username: neynarUser?.username ?? credentials?.name ?? '',
            pfpUrl: neynarUser?.pfp_url ?? credentials?.pfp ?? '',
            bio: neynarUser?.profile.bio.text ?? '',
            displayName: neynarUser?.display_name ?? '',
            currentWalletAddress: address ?? '0x0',
          };

          // Create user idempotently
          const userId = await insertUserByFid({
            fid,
            initializedAt: neynarUser ? Date.now() : undefined, // if neynar user failed
            ...userData,
          });

          return {
            id: userId,
            fid,
            image: userData.pfpUrl,
            ...userData,
          };
        } catch (error) {
          console.error('Error getting Neynar user', { fid, error });
          return null;
        }
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user = token.user as typeof session.user;
      }

      try {
        const privateKey = await importPKCS8(process.env.CONVEX_AUTH_PRIVATE_KEY!, 'RS256');
        const convexToken = await new SignJWT({
          sub: session.user.id,
        })
          .setProtectedHeader({ alg: 'RS256' })
          .setIssuedAt()
          .setIssuer(CONVEX_SITE_URL)
          .setAudience('convex')
          .setExpirationTime('1h')
          .sign(privateKey);

        session.convexToken = convexToken;
      } catch (error) {
        console.error('Error generating convex token', { error });
      }

      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
        token.name = user.name;
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
};

export const getSession = async () => {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error('Error getting server session:', error);
    return null;
  }
};
