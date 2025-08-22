import { createEventFormSchema } from 'app/entities/schemas';
import { z } from 'zod';

// Update event schema: image optional, tickets removed
export const updateEventFormSchema = createEventFormSchema
  .omit({ tickets: true })
  .extend({
    // Image must be present when updating
    image: z.instanceof(File),
  })
  .refine(
    (data) => {
      const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
      const endDateTime = new Date(`${data.endDate}T${data.endTime}`);
      return endDateTime > startDateTime;
    },
    {
      message: 'End date/time must be after start date/time',
      path: ['endTime'], // This will show the error on the endTime field
    }
  );

export type UpdateEventFormData = z.infer<typeof updateEventFormSchema>;
