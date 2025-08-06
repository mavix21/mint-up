'use server';

import { api } from '../../../../backend/convex/_generated/api';
import type { Id } from '../../../../backend/convex/_generated/dataModel';
import { fetchMutation, fetchQuery } from '../../../../backend/convex/nextjs';

export async function uploadFile(file: File) {
  const uploadUrl = await fetchMutation(api.storage.generateUploadUrl);
  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const response = await res.json();

  const storageId = response.storageId as Id<'_storage'>;
  const url = await fetchQuery(api.storage.getUrl, { storageId });

  return { storageId, url };
}
