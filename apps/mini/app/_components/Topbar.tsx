import { Address, Avatar, Name, Identity, EthBalance } from '@coinbase/onchainkit/identity';
import { useAuthenticate } from '@coinbase/onchainkit/minikit';
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

import { useMiniApp } from '@/contexts/mini-app.context';

export function Topbar() {
  const { addFrame } = useMiniApp();
  const { signIn } = useAuthenticate('localhost:3000');
  const handleSignIn = async () => {
    const result = await signIn();
    if (result === false) {
      console.log('sign in failed');
    } else {
      console.log('sign in success', { result });
    }
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
      <Button circular icon={<Plus />} onPress={addFrame} />
      <Button circular icon={<Settings />} onPress={handleSignIn} />
    </XStack>
  );
}
