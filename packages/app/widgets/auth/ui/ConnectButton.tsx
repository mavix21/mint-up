'use client';

import { ButtonProps, LoadingButton } from '@my/ui';
import { useSignIn } from 'app/shared/lib/hooks/use-sign-in';

export function ConnectButton({ label = 'Sign In', ...props }: ButtonProps & { label?: string }) {
  const { signIn, isLoading } = useSignIn();
  return (
    <LoadingButton
      {...props}
      isLoading={isLoading}
      theme="green"
      themeInverse
      size="$4"
      onPress={signIn}
      label={label}
    />
  );
}
