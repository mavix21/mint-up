import { formOptions } from '@tanstack/react-form';
import { EventLocation } from 'app/entities/schemas';

export const createEventFormOpts = formOptions({
  defaultValues: {
    location: {
      type: 'in-person' as const,
      address: '',
      instructions: '',
    } as EventLocation,
  },
});
