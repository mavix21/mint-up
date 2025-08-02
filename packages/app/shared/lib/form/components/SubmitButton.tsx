// /**
//  * created to be used in forms
//  * will show loading spinners and disable submission when already submitting

import { AnimatePresence, Button, ButtonProps, Spinner } from '@my/ui';

import { useFormContext } from '../context';

//  */
export const SubmitButton = (props: ButtonProps) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          iconAfter={
            <AnimatePresence>
              {isSubmitting && (
                <Spinner
                  color="$color"
                  key="loading-spinner"
                  o={1}
                  y={0}
                  animation="quick"
                  enterStyle={{
                    o: 0,
                    y: 4,
                  }}
                  exitStyle={{
                    o: 0,
                    y: 4,
                  }}
                />
              )}
            </AnimatePresence>
          }
          disabled={isSubmitting}
          {...props}
        />
      )}
    </form.Subscribe>
  );
};
