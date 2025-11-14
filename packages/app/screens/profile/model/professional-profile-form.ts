import { z } from 'zod';

export const PROFESSIONAL_PROFILE_ROLES = ['Founder', 'Developer', 'Investor', 'Designer'] as const;

const MAX_COMPANY_LENGTH = 100;
const MAX_LINK_LENGTH = 2048;
const PROFESSIONAL_LINK_REGEX = /^https?:\/\/.+/i;

export const professionalProfileFormSchema = z.object({
  worksAt: z
    .string()
    .max(
      MAX_COMPANY_LENGTH,
      `Company or protocol name must be less than ${MAX_COMPANY_LENGTH} characters`
    )
    .transform((value) => value.trim()),
  roles: z
    .array(z.enum(PROFESSIONAL_PROFILE_ROLES))
    .max(PROFESSIONAL_PROFILE_ROLES.length, 'Too many roles selected')
    .transform((roles) => Array.from(new Set(roles)))
    .default([]),
  professionalLink: z
    .string()
    .max(MAX_LINK_LENGTH, 'Link is too long')
    .transform((value) => value.trim())
    .refine(
      (value) => value.length === 0 || PROFESSIONAL_LINK_REGEX.test(value),
      'Please enter a valid URL starting with http or https'
    ),
});

export type ProfessionalProfileFormValues = z.infer<typeof professionalProfileFormSchema>;

export type ProfessionalProfileRole = (typeof PROFESSIONAL_PROFILE_ROLES)[number];

export const emptyProfessionalProfileFormValues: ProfessionalProfileFormValues = {
  worksAt: '',
  roles: [],
  professionalLink: '',
};

export interface ProfessionalProfileViewModel {
  worksAt?: string;
  roles?: ProfessionalProfileRole[];
  professionalLink?: string;
}

export const mapProfessionalProfileToFormValues = (
  profile?: ProfessionalProfileViewModel | null
): ProfessionalProfileFormValues => ({
  worksAt: profile?.worksAt ?? '',
  roles: profile?.roles ?? [],
  professionalLink: profile?.professionalLink ?? '',
});
