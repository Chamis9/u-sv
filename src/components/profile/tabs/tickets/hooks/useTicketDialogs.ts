
import { useState } from "react";
import { UserTicket } from "@/hooks/tickets";

export function useTicketDialogs() {
  const [addTicketOpen, setAddTicketOpen] = useState(false);
  const [editTicketOpen, setEditTicketOpen] = useState(false);
  const [currentEditTicket, setCurrentEditTicket] = useState<UserTicket | null>(null);

  const openAddTicketDialog = () => {
    setAddTicketOpen(true);
  };

  const closeAddTicketDialog = () => {
    setAddTicketOpen(false);
  };

  const openEditTicketDialog = (ticket: UserTicket) => {
    setCurrentEditTicket(ticket);
    setEditTicketOpen(true);
  };

  const closeEditTicketDialog = () => {
    setEditTicketOpen(false);
    setCurrentEditTicket(null);
  };

  return {
    addTicketOpen,
    setAddTicketOpen,
    editTicketOpen,
    setEditTicketOpen,
    currentEditTicket,
    setCurrentEditTicket,
    openAddTicketDialog,
    closeAddTicketDialog,
    openEditTicketDialog,
    closeEditTicketDialog
  };
}
