import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { SizableText, YStack } from '@my/ui';
import { abi } from 'app/shared/lib/abi';
import {
  BASE_CHAIN_ID,
  MINTUP_FACTORY_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
} from 'app/shared/lib/constants';
import { usdcAbi } from 'app/shared/lib/usdc_abi';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { parseUnits } from 'viem';

interface BuyTicketButtonProps {
  handleOnStatus: (status: LifecycleStatus) => void;
  price: number;
  tokenId: string;
}

export function BuyTicketButton({ handleOnStatus, price, tokenId }: BuyTicketButtonProps) {
  const { data: session } = useSession();

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

  if (!session) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <SizableText>Please sign in to buy a ticket</SizableText>
      </YStack>
    );
  }

  return (
    <Transaction calls={calls} chainId={BASE_CHAIN_ID} onStatus={handleOnStatus}>
      <TransactionButton className="text-center" text="Mint Ticket" />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  );
}
