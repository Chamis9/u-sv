
import { useState } from 'react';
import { UserTicket } from '@/hooks/tickets';

// Shared state for the ticket dialog
let globalSelectedTicket: UserTicket | null = null;
let globalSetSelectedTicket: ((ticket: UserTicket | null) => void) | null = null;

export function useTicketDialog() {
  const [selectedTicket, setSelectedTicketState] = useState<UserTicket | null>(null);
  
  // Set up the global setter reference
  if (!globalSetSelectedTicket) {
    globalSetSelectedTicket = setSelectedTicketState;
  }
  
  // Custom setter that updates both local and global state
  const setSelectedTicket = (ticket: UserTicket | null) => {
    globalSelectedTicket = ticket;
    setSelectedTicketState(ticket);
  };
  
  // Check if we need to sync with global state
  if (globalSelectedTicket && globalSelectedTicket !== selectedTicket) {
    setSelectedTicketState(globalSelectedTicket);
    globalSelectedTicket = null;
  }
  
  return {
    selectedTicket,
    setSelectedTicket
  };
}

// Export a function to open the dialog from other components
export function openTicketDialog(ticket: UserTicket) {
  globalSelectedTicket = ticket;
  if (globalSetSelectedTicket) {
    globalSetSelectedTicket(ticket);
  }
}
