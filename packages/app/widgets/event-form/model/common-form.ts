import { formOptions } from '@tanstack/react-form';
import { EventCategory, EventLocation } from 'app/entities/schemas';

export interface CommonEventFormValues {
  name: string;
  category: EventCategory;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: EventLocation;
  description: string;
  theme: string | undefined;
}

export const commonEventFormOpts = formOptions({
  defaultValues: {
    name: '',
    category: '' as EventCategory,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: {
      type: 'in-person',
      address: '',
      instructions: '',
    },
    description: '',
    theme: undefined,
  },
});
