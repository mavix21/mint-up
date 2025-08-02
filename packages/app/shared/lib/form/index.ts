import { createFormHook } from '@tanstack/react-form';

import { SubmitButton } from './components/SubmitButton';
import { fieldContext, formContext } from './context';
import { TextField } from './fields/TextField';

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
