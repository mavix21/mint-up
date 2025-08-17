import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { SizableText, YStack } from '@my/ui';
import { abi } from 'app/shared/lib/abi';
import {
  BASE_CHAIN_ID,
  MINTUP_FACTORY_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
} from 'app/shared/lib/constants';
import { usdcAbi } from 'app/shared/lib/usdc_abi';
import { useMemo } from 'react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';

interface BuyTicketButtonProps {
  handleOnStatus: (status: LifecycleStatus) => void;
  price: number;
  tokenId: string;
}

export function BuyTicketButton({ handleOnStatus, price, tokenId }: BuyTicketButtonProps) {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  console.warn('ADDRESS', 'BASE_CHAIN_ID', { BASE_CHAIN_ID, address });

  const calls = useMemo(
    () => [
      {
        address: USDC_CONTRACT_ADDRESS,
        abi: usdcAbi,
        functionName: 'approve',
        args: [MINTUP_FACTORY_CONTRACT_ADDRESS, parseUnits(price.toString(), 6)],
      },
      {
        address: MINTUP_FACTORY_CONTRACT_ADDRESS,
        abi,
        functionName: 'mintTicket',
        args: [BigInt(tokenId)],
        value: 0n,
      },
    ],
    [tokenId]
  );

  if (!address) {
    return (
      <YStack>
        <YStack gap="$2">
          <SizableText>Connection Information</SizableText>
          <SizableText>{'Address: ' + address}</SizableText>
          <SizableText>{'Is Connected: ' + isConnected}</SizableText>
          <SizableText>{'Is Connecting: ' + isConnecting}</SizableText>
          <SizableText>{'Is Disconnected: ' + isDisconnected}</SizableText>
        </YStack>
        <ConnectWallet />
      </YStack>
    );
  }

  return (
    <Transaction calls={calls} chainId={BASE_CHAIN_ID} onStatus={handleOnStatus}>
      <TransactionButton className="text-center" />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  );
}
