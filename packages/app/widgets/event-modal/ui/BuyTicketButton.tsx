import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { abi } from 'app/shared/lib/abi';
import { BASE_CHAIN_ID, MINTUP_FACTORY_CONTRACT_ADDRESS } from 'app/shared/lib/constants';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

interface BuyTicketButtonProps {
  handleOnStatus: (status: LifecycleStatus) => void;
  price: number;
  tokenId: string;
}

export function BuyTicketButton({ handleOnStatus, price, tokenId }: BuyTicketButtonProps) {
  const { address } = useAccount();
  console.log(address);

  const calls = useMemo(
    () => [
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
    return <ConnectWallet />;
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
