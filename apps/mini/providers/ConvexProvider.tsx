'use client';

import { ConvexProviderWithAuth, ConvexReactClient } from 'convex/react';
import { useSession } from 'next-auth/react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? '');

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithAuth>
  );
}

function useAuth() {
  const { data: session, update } = useSession();

  const convexToken = convexTokenFromSession(session);
  return useMemo(
    () => ({
      isLoading: false,
      isAuthenticated: session !== null,
      fetchAccessToken: async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
        if (forceRefreshToken) {
          const session = await update();

          return convexTokenFromSession(session);
        }
        return convexToken;
      },
    }),
    // We only care about the user changes, and don't want to
    // bust the memo when we fetch a new token.
    [JSON.stringify(session?.user)]
  );
}

function convexTokenFromSession(session: Session | null): string | null {
  return session?.convexToken ?? null;
}
