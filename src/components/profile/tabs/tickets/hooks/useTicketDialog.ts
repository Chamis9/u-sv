
import { useState } from "react";
import { UserTicket } from "@/hooks/tickets";

export function useTicketDialog() {
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);
  
  // Helper function to open ticket dialog
  const openTicketDialog = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
  };
  
  // Helper function to close ticket dialog
  const closeTicketDialog = () => {
    setSelectedTicket(null);
  };

  return {
    selectedTicket,
    setSelectedTicket,
    openTicketDialog,
    closeTicketDialog
  };
}

// Export this as a function for easier import in index files
export const openTicketDialog = (
  ticket: UserTicket,
  setSelectedTicket: (ticket: UserTicket | null) => void
) => {
  setSelectedTicket(ticket);
};
