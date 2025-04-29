
import { useTicketQueries } from "./useTicketQueries";
import { useTicketMutations } from "./useTicketMutations";
import { AddTicketData, UserTicket } from "./types";
import { useTicketStorage } from "./useTicketStorage";

export function useUserTickets(userId?: string) {
  const { tickets, isLoading, error } = useTicketQueries(userId);
  const { loading, addTicket, deleteTicket } = useTicketMutations(userId);
  const { uploadTicketFile, deleteTicketFile, uploading } = useTicketStorage();
  
  return {
    tickets,
    isLoading,
    error,
    loading: loading || uploading,
    addTicket,
    deleteTicket,
    uploadTicketFile,
    deleteTicketFile,
    uploading
  };
}

// Re-export types and hooks for easier imports
export type { UserTicket, AddTicketData } from "./types";
export { useTicketStorage } from "./useTicketStorage";
export { useTicketQueries } from "./useTicketQueries";
export { useTicketMutations } from "./useTicketMutations";
