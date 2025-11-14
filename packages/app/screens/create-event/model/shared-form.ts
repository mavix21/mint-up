import { formOptions } from '@tanstack/react-form';
import type { Id } from '@my/backend/_generated/dataModel';
import { EventCategory, EventLocation, TicketType } from 'app/entities/schemas';
import type { EventOwnershipType } from 'app/entities/event-ownership';

export const createEventFormOpts = formOptions({
  defaultValues: {
    ownershipType: 'individual' as EventOwnershipType,
    organizationId: null as Id<'organizations'> | null,
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
    theme: undefined as string | undefined,
  },
});
