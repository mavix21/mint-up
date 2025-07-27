import { Address, Avatar, Name, Identity, EthBalance } from '@coinbase/onchainkit/identity';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownFundLink,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { Button, XStack } from '@my/ui';
import { Plus, Settings } from '@tamagui/lucide-icons';
import { memo } from 'react';

import { SignInWithFarcaster } from './SignInWithFarcaster';

import { useMiniApp } from '@/contexts/mini-app.context';
import { useSignIn } from '@/lib/hooks/use-sign-in';

export const Topbar = memo(() => {
  const { addFrame, context } = useMiniApp();
  const { signIn, isSignedIn } = useSignIn();
  const handleAddFrame = async () => {
    await addFrame();
  };

  return (
    <XStack
      flex={1}
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      px="$4"
      py="$3"
      maxInlineSize={600}
      marginInline="auto"
    >
      <Wallet className="!p-0">
        <ConnectWallet>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown className="z-10">
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownBasename />
          <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
            Wallet
          </WalletDropdownLink>
          <WalletDropdownFundLink />
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
      <XStack gap="$2">
        {context === undefined && !isSignedIn && <SignInWithFarcaster />}
        <Button circular icon={<Plus />} onPress={handleAddFrame} />
        <Button circular icon={<Settings />} onPress={signIn} />
      </XStack>
    </XStack>
  );
});
