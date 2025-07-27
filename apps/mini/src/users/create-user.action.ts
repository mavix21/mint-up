'use server';

import { api } from '@my/backend/_generated/api';
import { fetchMutation } from '@my/backend/nextjs';

interface CreateUserByFidArgs {
  fid: number;
  username: string;
  pfpUrl: string;
  displayName?: string;
  bio?: string;
  currentWalletAddress?: string;
}

export async function createUserByFid({
  fid,
  currentWalletAddress,
  username,
  pfpUrl,
  displayName,
  bio,
}: CreateUserByFidArgs) {
  const normalizedCurrentWalletAddress = currentWalletAddress?.toLowerCase();

  return await fetchMutation(api.users.createUserByFid, {
    fid,
    currentWalletAddress: normalizedCurrentWalletAddress,
    username,
    pfpUrl,
    displayName,
    bio,
  });
}
