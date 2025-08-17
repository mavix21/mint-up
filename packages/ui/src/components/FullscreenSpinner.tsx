import { Spinner, SpinnerProps, Theme, YStack } from 'tamagui';

export const FullscreenSpinner = (props: SpinnerProps) => {
  return (
    <YStack f={1} jc="center" ai="center" height={'100vh' as any}>
      <Theme name={props.theme ?? 'green'}>
        <Spinner color="$color10" size={props.size ?? 'large'} {...props} />
      </Theme>
    </YStack>
  );
};
