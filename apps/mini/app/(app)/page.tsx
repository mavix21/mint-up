'use client';

import { Name, Identity, Address, Avatar, EthBalance } from '@coinbase/onchainkit/identity';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { Button, XStack, YStack } from '@my/ui';
import { useEffect, useState } from 'react';

import { BottomTabNav } from '../_components/BottomTabNav';
import { CreateEventSheetWrapper } from '../_components/CreateEventSheetWrapper';

export default function HomePage() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const [open, setOpen] = useState(false);
  // The setFrameReady() function is called when your mini-app is ready to be shown
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <>
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        height={'100vh' as any}
        position="relative"
        gap={20}
        bg="$background"
      >
        <XStack gap="$4">
          <Button onPress={() => setOpen(true)}>Click me</Button>

          <Wallet className="z-10">
            <ConnectWallet>
              <Name className="text-inherit" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </XStack>
        <BottomTabNav
          activeTab="home"
          setActiveTab={(tab) => {
            if (tab === 'create') {
              setOpen(true);
            }
          }}
        />
      </YStack>
      <CreateEventSheetWrapper open={open} setOpen={setOpen} />
    </>
  );
}
