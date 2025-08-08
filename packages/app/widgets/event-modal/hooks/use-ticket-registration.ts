import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useState } from 'react';

export interface RegistrationState {
  isRegistering: boolean;
  error: string | null;
  success: boolean;
}

export interface UseTicketRegistrationReturn {
  registrationState: RegistrationState;
  registerTicket: (eventId: string, ticketTemplateId: string) => Promise<void>;
  resetState: () => void;
}

export function useTicketRegistration(): UseTicketRegistrationReturn {
  const [state, setState] = useState<RegistrationState>({
    isRegistering: false,
    error: null,
    success: false,
  });

  const createRegistration = useMutation(api.registrations.createRegistration);

  const registerTicket = async (eventId: string, ticketTemplateId: string) => {
    setState({
      isRegistering: true,
      error: null,
      success: false,
    });

    try {
      await createRegistration({
        eventId: eventId as Id<'events'>,
        ticketTemplateId: ticketTemplateId as Id<'ticketTemplates'>,
      });

      setState({
        isRegistering: false,
        error: null,
        success: true,
      });
    } catch (err) {
      setState({
        isRegistering: false,
        error: err instanceof Error ? err.message : 'Registration failed',
        success: false,
      });
    }
  };

  const resetState = () => {
    setState({
      isRegistering: false,
      error: null,
      success: false,
    });
  };

  return {
    registrationState: state,
    registerTicket,
    resetState,
  };
}
