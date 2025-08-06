import { formOptions } from '@tanstack/react-form';
import { EventCategory, EventLocation, TicketType } from 'app/entities/schemas';

export const createEventFormOpts = formOptions({
  defaultValues: {
    name: '',
    category: '' as EventCategory,
    image: undefined as File | undefined,
    location: {
      type: 'in-person' as const,
      address: '',
      instructions: '',
    } as EventLocation,
    description: '',
    tickets: [
      {
        id: '1',
        name: 'Standard',
        description: 'Standard ticket',
        type: 'free',
      },
    ] as TicketType[],
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  },
});
