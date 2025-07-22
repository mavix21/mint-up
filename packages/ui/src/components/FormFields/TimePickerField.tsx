// import { TimeSchema } from '@my/app/utils/SchemaForm';
// import { useFieldInfo, useTsController } from '@ts-react/form';
// import { useId, useImperativeHandle, useRef } from 'react';
// import { Fieldset, type InputProps, Label, Theme, XStack } from 'tamagui';

// import { FieldError } from '../FieldError';
// import { Shake } from '../Shake';
// import { TimePicker } from '../elements/timepicker/TimePicker';

// export const TimePickerField = (props: Pick<InputProps, 'size'>) => {
//   const {
//     field,
//     error,
//     formState: { isSubmitting },
//   } = useTsController<ReturnType<typeof TimeSchema.parse>>();

//   const { label } = useFieldInfo();
//   const id = useId();
//   const disabled = isSubmitting;
//   const inputRef = useRef<HTMLInputElement>(null);
//   useImperativeHandle(field.ref, () => inputRef.current);

//   return (
//     <Fieldset gap="$2">
//       <Label theme="alt1" size="$3">
//         {label}
//       </Label>
//       <XStack $sm={{ fd: 'column' }} $gtSm={{ fw: 'wrap' }} gap="$4">
//         <Theme name={error?.timeValue ? 'red' : null} forceClassName>
//           <Fieldset $gtSm={{ fb: 0 }} f={1}>
//             <Shake shakeKey={error?.timeValue?.errorMessage}>
//               <TimePicker
//                 disabled={disabled}
//                 placeholderTextColor="$color10"
//                 value={field.value?.timeValue}
//                 onChangeText={(timeValue) => field.onChange({ ...field.value, timeValue })}
//                 onBlur={field.onBlur}
//                 ref={inputRef}
//                 id={`${id}-time-value`}
//                 {...props}
//               />
//             </Shake>
//             <FieldError message={error?.timeValue?.errorMessage} />
//           </Fieldset>
//         </Theme>
//       </XStack>
//     </Fieldset>
//   );
// };
