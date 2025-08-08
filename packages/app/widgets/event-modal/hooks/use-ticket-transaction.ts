import { useState } from 'react';
import { parseEther } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

import { abi } from '../../../shared/lib/abi';
import { MINTUP_FACTORY_CONTRACT_ADDRESS } from '../../../shared/lib/constants';
import { TicketTemplate, isOnchainTicket } from '../utils/ticket-types';

export interface TransactionState {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  hash: string | null;
}

export interface UseTicketTransactionReturn {
  transactionState: TransactionState;
  purchaseTicket: (ticket: TicketTemplate) => Promise<void>;
  resetTransaction: () => void;
}

export function useTicketTransaction(): UseTicketTransactionReturn {
  const [state, setState] = useState<TransactionState>({
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    hash: null,
  });

  const { writeContract, isPending, isError, error, data: hash } = useWriteContract();

  const {
    data: receipt,
    isSuccess,
    isError: receiptError,
  } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}`,
  });

  const purchaseTicket = async (ticket: TicketTemplate) => {
    if (!isOnchainTicket(ticket)) {
      throw new Error('Ticket is not an onchain ticket');
    }

    if (ticket.ticketType.syncStatus.status !== 'synced') {
      throw new Error('Ticket is not synced to blockchain');
    }

    setState({
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
      hash: null,
    });

    try {
      const { amount, currency } = ticket.ticketType.price;

      // Handle different currencies
      if (currency === 'ETH') {
        const priceInEth = parseEther(amount.toString());
        writeContract({
          address: MINTUP_FACTORY_CONTRACT_ADDRESS,
          abi,
          functionName: 'mintTicket',
          args: [BigInt(ticket.ticketType.syncStatus.tokenId)],
          value: priceInEth,
        });
      } else if (currency === 'USDC') {
        // For USDC payments, the contract handles USDC transfer internally
        // We just call mintTicket without ETH value
        writeContract({
          address: MINTUP_FACTORY_CONTRACT_ADDRESS,
          abi,
          functionName: 'mintTicket',
          args: [BigInt(ticket.ticketType.syncStatus.tokenId)],
          value: 0n, // No ETH value for USDC payments
        });
      } else {
        throw new Error(`Unsupported currency: ${currency}`);
      }
    } catch (err) {
      setState({
        isPending: false,
        isSuccess: false,
        isError: true,
        error: err instanceof Error ? err.message : 'Transaction failed',
        hash: null,
      });
    }
  };

  const resetTransaction = () => {
    setState({
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      hash: null,
    });
  };

  // Update state based on wagmi hooks
  if (isPending && !state.isPending) {
    setState((prev) => ({ ...prev, isPending: true }));
  }

  if (isError && !state.isError) {
    setState((prev) => ({
      ...prev,
      isError: true,
      error: error?.message || 'Transaction failed',
      isPending: false,
    }));
  }

  // Only mark as success when we have both success and receipt
  if (isSuccess && receipt && !state.isSuccess) {
    setState((prev) => ({
      ...prev,
      isSuccess: true,
      isPending: false,
    }));
  }

  // Handle transaction receipt errors
  if (receiptError && !state.isError) {
    setState((prev) => ({
      ...prev,
      isError: true,
      error: 'Transaction failed on blockchain',
      isPending: false,
    }));
  }

  // Update hash when available
  if (hash && hash !== state.hash) {
    setState((prev) => ({ ...prev, hash }));
  }

  return {
    transactionState: state,
    purchaseTicket,
    resetTransaction,
  };
}
