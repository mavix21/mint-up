import { UseTicketRegistrationReturn } from '../hooks/use-ticket-registration';
import { UseTicketTransactionReturn } from '../hooks/use-ticket-transaction';
import { TicketTemplate, isTicketFree, isTicketPaid, isTicketSynced } from '../utils/ticket-types';

export interface TicketRegistrationResult {
  success: boolean;
  error?: string;
  transactionHash?: string;
}

export class TicketRegistrationService {
  constructor(
    private registrationHook: UseTicketRegistrationReturn,
    private transactionHook: UseTicketTransactionReturn
  ) {}

  async registerTicket(eventId: string, ticket: TicketTemplate): Promise<TicketRegistrationResult> {
    try {
      if (isTicketFree(ticket)) {
        // For free tickets, just register directly
        await this.registrationHook.registerTicket(eventId, ticket._id);

        if (this.registrationHook.registrationState.error) {
          return {
            success: false,
            error: this.registrationHook.registrationState.error,
          };
        }

        return { success: true };
      }

      if (isTicketPaid(ticket)) {
        // For paid tickets, initiate the transaction
        // The transaction state will be managed by wagmi hooks
        await this.transactionHook.purchaseTicket(ticket);

        // Return immediately - the UI will handle transaction state updates
        // The transaction success/failure will be handled by the wagmi hooks
        // and reflected in the UI through the transaction state
        return {
          success: false, // Transaction is in progress
          error: undefined,
        };
      }

      return {
        success: false,
        error: 'Invalid ticket type',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }

  resetStates() {
    this.registrationHook.resetState();
    this.transactionHook.resetTransaction();
  }

  getRegistrationState() {
    return this.registrationHook.registrationState;
  }

  getTransactionState() {
    return this.transactionHook.transactionState;
  }

  isProcessing() {
    return (
      this.registrationHook.registrationState.isRegistering ||
      this.transactionHook.transactionState.isPending
    );
  }

  hasError() {
    return (
      this.registrationHook.registrationState.error || this.transactionHook.transactionState.error
    );
  }

  getErrorMessage() {
    return (
      this.registrationHook.registrationState.error ||
      this.transactionHook.transactionState.error ||
      'An error occurred'
    );
  }

  // Helper method to check if a ticket can be purchased
  canPurchaseTicket(ticket: TicketTemplate): boolean {
    if (isTicketFree(ticket)) {
      return true;
    }

    if (isTicketPaid(ticket)) {
      return isTicketSynced(ticket);
    }

    return false;
  }
}
