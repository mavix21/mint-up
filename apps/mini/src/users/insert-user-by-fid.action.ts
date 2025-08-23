'use server';

import { api } from '@my/backend/_generated/api';
import { fetchMutation } from '@my/backend/nextjs';

interface InsertUserByFidArgs {
  fid: number;
  username: string;
  pfpUrl: string;
  displayName?: string;
  bio?: string;
  currentWalletAddress?: string;
  initializedAt?: number | undefined;
}

export async function insertUserByFid({
  fid,
  currentWalletAddress,
  username,
  pfpUrl,
  displayName,
  bio,
  initializedAt,
}: InsertUserByFidArgs) {
  const normalizedCurrentWalletAddress = currentWalletAddress?.toLowerCase();

  return await fetchMutation(api.users.insertUserByFid, {
    fid,
    currentWalletAddress: normalizedCurrentWalletAddress,
    username,
    pfpUrl,
    displayName,
    bio,
    initializedAt,
  });
}
