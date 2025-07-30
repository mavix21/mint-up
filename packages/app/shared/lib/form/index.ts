import { createFormHook } from '@tanstack/react-form';

import { fieldContext, formContext } from './context';
import { TextField } from './fields/TextField';

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
