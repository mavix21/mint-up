import { createEventFormSchema } from 'app/entities/schemas';
import { z } from 'zod';

// Update event schema: image optional, tickets removed
export const updateEventFormSchema = createEventFormSchema.omit({ tickets: true }).extend({
  // Image must be present when updating
  image: z.instanceof(File),
});

export type UpdateEventFormData = z.infer<typeof updateEventFormSchema>;
