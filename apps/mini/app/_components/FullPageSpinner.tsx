import { Spinner, Theme, YStack } from '@my/ui';

export function FullPageSpinner() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" height={'100svh' as any}>
      <Theme name="green">
        <Spinner size="large" color="$color10" />
      </Theme>
    </YStack>
  );
}
