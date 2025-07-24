import { z } from 'zod';

import {
  createEventFormSchema,
  submitEventSchema,
  safeValidateCreateEventForm,
  validateCreateEventForm,
  type CreateEventFormData,
  type SubmitEventData,
  type CreateEventFormErrors,
} from '../../../entities';

// Re-export the main schemas for convenience
export {
  createEventFormSchema,
  submitEventSchema,
  safeValidateCreateEventForm,
  validateCreateEventForm,
  type CreateEventFormData,
  type SubmitEventData,
  type CreateEventFormErrors,
};

// Form validation hook type
export interface FormValidationResult {
  isValid: boolean;
  errors: CreateEventFormErrors | null;
  data: CreateEventFormData | null;
}

// Custom validation hook for the form
export const useFormValidation = (formData: any): FormValidationResult => {
  const result = safeValidateCreateEventForm(formData);

  if (result.success) {
    return {
      isValid: true,
      errors: null,
      data: result.data,
    };
  }

  return {
    isValid: false,
    errors: result.errors,
    data: null,
  };
};

// Field-specific error extraction
export const getFieldError = (
  errors: CreateEventFormErrors | null,
  fieldPath: string
): string | undefined => {
  if (!errors) return undefined;

  const pathParts = fieldPath.split('.');
  let current: any = errors;

  for (const part of pathParts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current?._errors?.[0];
};

// Validation for specific form sections
export const validateLocation = (location: any) => {
  try {
    return { isValid: true, data: location };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, errors: error.format() };
    }
    throw error;
  }
};

export const validateTickets = (tickets: any[]) => {
  try {
    return { isValid: true, data: tickets };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, errors: error.format() };
    }
    throw error;
  }
};

// Helper to check if form is ready for submission
export const isFormReadyForSubmission = (formData: any): boolean => {
  const result = safeValidateCreateEventForm(formData);
  return result.success;
};

// Transform form data for API submission
export const prepareFormForSubmission = (formData: CreateEventFormData): SubmitEventData => {
  return submitEventSchema.parse({
    ...formData,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};
