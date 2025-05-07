
import { useState } from "react";
import { UserTicket } from "@/hooks/tickets";

// Helper to open ticket dialog
export const openTicketDialog = (
  ticket: UserTicket,
  setSelectedTicket: React.Dispatch<React.SetStateAction<UserTicket | null>>
) => {
  setSelectedTicket(ticket);
};

export function useTicketDialog() {
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);
  
  return {
    selectedTicket,
    setSelectedTicket
  };
}
