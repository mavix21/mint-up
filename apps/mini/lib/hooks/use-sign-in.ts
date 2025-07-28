import { useAuthenticate } from '@coinbase/onchainkit/minikit';
import { getCsrfToken, signIn as nextAuthSignIn, useSession } from 'next-auth/react';
import { useCallback } from 'react';

export const useSignIn = () => {
  const { data: session, status } = useSession();
  // This method allows for Sign In with Farcaster (SIWF)
  const { signIn } = useAuthenticate();

  const handleSignIn = useCallback(async () => {
    try {
      const csrfToken = await getCsrfToken();
      if (!csrfToken) {
        throw new Error('Could not get CSRF token');
      }
      console.warn('csrfToken', csrfToken);
      const result = await signIn({
        nonce: csrfToken,
      });
      if (!result) {
        // throw new Error('Sign in with Farcaster failed');
        return;
      }

      const { message, signature } = result;

      const response = await nextAuthSignIn('credentials', {
        message,
        signature,
        redirect: false,
      });
      console.warn('response', response);
    } catch (error) {
      console.error('[Error] sign in', error);
    }
  }, [signIn]);

  return {
    signIn: handleSignIn,
    session,
    isSignedIn: status === 'authenticated',
    isLoading: status === 'loading',
  };
};
