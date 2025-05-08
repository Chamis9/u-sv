
import { useState } from 'react';
import { UserTicket } from '@/hooks/tickets';

type DeleteTicketFn = ((ticketId: string) => void) | undefined;

export const useTicketActions = (onDelete?: DeleteTicketFn) => {
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (ticketId: string) => {
    console.log("Setting ticket to delete:", ticketId);
    setTicketToDelete(ticketId);
  };

  const cancelDelete = () => {
    setTicketToDelete(null);
  };

  const confirmDelete = async () => {
    if (!ticketToDelete || !onDelete) return;
    
    try {
      setIsDeleting(true);
      console.log("Deleting ticket:", ticketToDelete);
      onDelete(ticketToDelete);
    } catch (error) {
      console.error("Error deleting ticket:", error);
    } finally {
      setIsDeleting(false);
      setTicketToDelete(null);
    }
  };

  return {
    isDeleting,
    ticketToDelete,
    handleDeleteClick,
    confirmDelete,
    cancelDelete
  };
};
