import { useAuthenticate, useMiniKit } from '@coinbase/onchainkit/minikit';

export const useSignIn = ({ autoSignIn = false }: { autoSignIn?: boolean }) => {
  const { context } = useMiniKit();
  const { signIn } = useAuthenticate();
};
