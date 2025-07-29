import { FieldError, Theme } from '@my/ui';
import { AnyFieldApi } from '@tanstack/react-form';

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  const errors = field.state.meta.errors;

  // Helper function to get the error message
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') {
      return error;
    }
    if (typeof error === 'object' && error?.message) {
      return error.message;
    }
    return 'An error occurred';
  };

  return (
    <Theme name="red" forceClassName>
      {field.state.meta.isTouched && !field.state.meta.isValid && errors.length > 0 && (
        <FieldError message={getErrorMessage(errors[0])} />
      )}
      {field.state.meta.isValidating && <FieldError message="Validating..." />}
    </Theme>
  );
}
