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
import { Button, Text, XStack } from '@my/ui';
import { Settings } from '@tamagui/lucide-icons';

export function Topbar() {
  return (
    <XStack
      flex={1}
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      p="$4"
      maxInlineSize={600}
      marginInline="auto"
    >
      <Wallet className="!p-0">
        <ConnectWallet>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
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
      <Button circular icon={<Settings />} />
    </XStack>
  );
}
