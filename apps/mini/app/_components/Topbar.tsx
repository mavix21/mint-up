import {
  Address,
  Avatar as BaseAvatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownFundLink,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { Avatar, XStack } from '@my/ui';
import { useSession } from 'next-auth/react';
import { memo, useState } from 'react';

import { SettingsDropdown } from './SettingsDropdown';
import { SignInWithFarcaster } from './SignInWithFarcaster';
import { ThemeSwitch } from './ThemeSwitch';

import { useMiniApp } from '@/contexts/mini-app.context';

export const Topbar = memo(() => {
  const { context } = useMiniApp();
  const { data: session } = useSession();
  const [triggerOpen, setTriggerOpen] = useState(false);

  return (
    <XStack
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
          {session ? (
            <Avatar circular size="$2">
              <Avatar.Image src={session.user.image} />
              <Avatar.Fallback />
            </Avatar>
          ) : (
            <BaseAvatar className="h-6 w-6" />
          )}
          <Name />
        </ConnectWallet>
        <WalletDropdown className="z-10">
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <BaseAvatar />
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
      <XStack gap="$2" alignItems="center">
        {context === undefined && !session && <SignInWithFarcaster />}
        <ThemeSwitch size="$3" />
        <SettingsDropdown triggerOpen={triggerOpen} setTriggerOpen={setTriggerOpen} />
      </XStack>
    </XStack>
  );
});
