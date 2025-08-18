import 'server-only';

import { api } from '@my/backend/_generated/api';
import { fetchQuery } from '@my/backend/nextjs';

export async function getUserByFid(fid: number) {
  return await fetchQuery(api.users.getUserByFid, {
    fid,
  });
}
