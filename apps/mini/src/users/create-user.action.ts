'use server';

import { api } from '@my/backend/_generated/api';
import { fetchMutation } from '@my/backend/nextjs';

interface UpsertUserByFidArgs {
  fid: number;
  username: string;
  pfpUrl: string;
  displayName?: string;
  bio?: string;
  currentWalletAddress?: string;
}

export async function upsertUserByFid({
  fid,
  currentWalletAddress,
  username,
  pfpUrl,
  displayName,
  bio,
}: UpsertUserByFidArgs) {
  const normalizedCurrentWalletAddress = currentWalletAddress?.toLowerCase();

  return await fetchMutation(api.users.upsertUserByFid, {
    fid,
    currentWalletAddress: normalizedCurrentWalletAddress,
    username,
    pfpUrl,
    displayName,
    bio,
  });
}
