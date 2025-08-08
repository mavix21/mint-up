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
        // For paid tickets, first purchase on blockchain, then register
        await this.transactionHook.purchaseTicket(ticket);

        // Wait for transaction to complete
        if (this.transactionHook.transactionState.isError) {
          return {
            success: false,
            error: this.transactionHook.transactionState.error || 'Transaction failed',
          };
        }

        // If transaction is successful, register the ticket
        if (this.transactionHook.transactionState.isSuccess) {
          await this.registrationHook.registerTicket(eventId, ticket._id);

          if (this.registrationHook.registrationState.error) {
            return {
              success: false,
              error: this.registrationHook.registrationState.error,
            };
          }

          return {
            success: true,
            transactionHash: this.transactionHook.transactionState.hash || undefined,
          };
        }

        // If transaction is still pending, return pending state
        if (this.transactionHook.transactionState.isPending) {
          return {
            success: false,
            error: 'Transaction is still processing. Please wait.',
          };
        }

        return {
          success: false,
          error: 'Transaction did not complete successfully',
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
