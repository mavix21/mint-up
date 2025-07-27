import { createAppClient, viemConnector } from '@farcaster/auth-client';
import type { AuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { getNeynarUser } from './lib/neynar';
import { ConvexAdapter } from './src/convexAdapter';

declare module 'next-auth' {
  interface Session {
    user: {
      fid: number;
      name: string;
      image: string;
    };
  }
}

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
  adapter: ConvexAdapter,
  // Configure one or more authentication providers
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

        const appClient = createAppClient({
          ethereum: viemConnector(),
        });

        const domain = getDomainFromUrl(process.env.NEXTAUTH_URL);

        const verifyResponse = await appClient.verifySignInMessage({
          message: credentials?.message!,
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
          const user = await getNeynarUser(fid);
          if (!user) {
            console.error('Failed to get Neynar user', { fid });
            return null;
          }

          return {
            id: fid.toString(),
            name: user.username,
            image: user.pfp_url,
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
        session.user.fid = parseInt(token.sub ?? '', 10);
        session.user.name = token.name ?? '';
      }
      return session;
    },
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
