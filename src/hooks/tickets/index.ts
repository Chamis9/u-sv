
// Main index file to re-export all ticket hooks
import { useEventTickets } from './useEventTickets';
import { useUserTickets } from './useUserTickets';
import { useUserPurchases } from './useUserPurchases';
import { useTicketFile } from './useTicketFile';
import { useTicketMutations } from './useTicketMutations';
import { Ticket, AddTicketData } from './types';

// Combined hook that provides all ticket functionality
export const useTickets = (eventId?: string) => {
  const { tickets, isLoading: isLoadingEventTickets } = useEventTickets(eventId);
  const { userTickets, isLoading: isLoadingUserTickets } = useUserTickets();
  const { userPurchases, isLoading: isLoadingUserPurchases } = useUserPurchases();
  const { getTicketFile } = useTicketFile();
  const { addTicket, deleteTicket, purchaseTicket } = useTicketMutations(eventId);

  return {
    eventTickets: tickets,
    userTickets,
    userPurchases,
    isLoadingEventTickets,
    isLoadingUserTickets,
    isLoadingUserPurchases,
    getTicketFile,
    addTicket,
    deleteTicket,
    purchaseTicket
  };
};

// Re-export types and individual hooks for more fine-grained usage
export type { Ticket, AddTicketData };
export {
  useEventTickets,
  useUserTickets,
  useUserPurchases,
  useTicketFile,
  useTicketMutations
};
