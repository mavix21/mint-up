import { formOptions } from '@tanstack/react-form';
import { z } from 'zod';

// Profile form data type
export interface ProfileFormData {
  bio: string;
  personalEmail: string;
  phoneNumber: string;
  team: string;
  leadsBy: string;
}

// Validation schema for profile form
export const profileFormSchema = z.object({
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .transform((val) => val.trim()),

  personalEmail: z
    .string()
    .email('Please enter a valid email address')
    .transform((val) => val.trim()),

  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .transform((val) => val.trim()),

  team: z
    .string()
    .min(1, 'Team is required')
    .max(100, 'Team name must be less than 100 characters')
    .transform((val) => val.trim()),

  leadsBy: z
    .string()
    .min(1, 'Lead is required')
    .max(100, 'Lead name must be less than 100 characters')
    .transform((val) => val.trim()),
});

// Form options with default values
export const profileFormOpts = formOptions({
  defaultValues: {
    bio: '',
    personalEmail: '',
    phoneNumber: '',
    team: '',
    leadsBy: '',
  } as ProfileFormData,
});

// Type for the validated form data
export type ValidatedProfileFormData = z.infer<typeof profileFormSchema>;
