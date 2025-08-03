import { Button, ButtonProps, Spinner, View } from '@my/ui';

import { useFormContext } from '../context';

// /**
//  * created to be used in forms
//  * will show loading spinners and disable submission when already submitting
//  */
export const SubmitButton = (props: ButtonProps & { label: string }) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button disabled={isSubmitting} {...props}>
          <View
            animation="bouncy"
            flexDirection="row"
            x={isSubmitting ? 0 : 15}
            gap="$3"
            alignItems="center"
            justifyContent="center"
          >
            <Button.Text fontWeight="600">{props.label}</Button.Text>
            <Button.Icon>
              <Spinner
                key="loading-spinner"
                animation="slow"
                enterStyle={{
                  scale: 1,
                }}
                exitStyle={{
                  scale: 1,
                }}
                opacity={isSubmitting ? 1 : 0}
              />
            </Button.Icon>
          </View>
        </Button>
      )}
    </form.Subscribe>
  );
};
