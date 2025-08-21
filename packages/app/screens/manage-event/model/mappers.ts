import { Doc } from '@my/backend/_generated/dataModel';
import { dateUtils } from 'app/shared/lib/date';

import { UpdateEventFormData } from './update-event.schema';

// Helpers to format timestamps to date/time strings (YYYY-MM-DD, HH:mm)
function toDateString(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toTimeString(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function eventToFormDefaults(event: Doc<'events'>) {
  return {
    name: event.name ?? '',
    category: event.category as unknown as UpdateEventFormData['category'],
    image: undefined as File | undefined,
    startDate: toDateString(event.startDate),
    startTime: toTimeString(event.startDate),
    endDate: toDateString(event.endDate),
    endTime: toTimeString(event.endDate),
    location: event.location as UpdateEventFormData['location'],
    description: event.description ?? '',
    theme: event.theme,
  } satisfies Partial<UpdateEventFormData>;
}

export function formToUpdatePayload(values: UpdateEventFormData) {
  const startTimestamp = dateUtils.toTimestamp(values.startDate)(values.startTime);
  const endTimestamp = dateUtils.toTimestamp(values.endDate)(values.endTime);

  return {
    name: values.name,
    theme: values.theme,
    category: values.category,
    image: values.image, // optional; upstream decide whether to upload
    startDate: startTimestamp,
    endDate: endTimestamp,
    location: values.location,
    description: values.description,
  };
}
