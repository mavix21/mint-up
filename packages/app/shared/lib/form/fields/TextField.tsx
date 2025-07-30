import { FieldError, Fieldset, Input, InputProps, Label, Theme } from '@my/ui';

import { useFieldContext } from '../context';

export function TextField({ label, ...props }: InputProps & { label: string }) {
  const field = useFieldContext<string>();
  const errors = field.state.meta.errors;

  return (
    <Theme
      name={field.state.meta.isTouched && !field.state.meta.isValid ? 'red' : null}
      forceClassName
    >
      <Fieldset gap="$2" flex={1}>
        <Label htmlFor={field.name} fontWeight="500">
          {label}
        </Label>
        <Input
          id={field.name}
          value={field.state.value}
          onChangeText={field.handleChange}
          onBlur={field.handleBlur}
          w="100%"
          {...props}
        />
        {errors.length > 0 && <FieldError message={errors[0]} />}
      </Fieldset>
    </Theme>
  );
}
