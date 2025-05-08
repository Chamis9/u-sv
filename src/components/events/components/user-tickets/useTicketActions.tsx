
import { useState } from 'react';
import { UserTicket } from "@/hooks/tickets";
import { useToast } from "@/hooks/use-toast";
import { deleteTicketMutation } from "@/hooks/tickets/mutations/deleteTicketMutation";

export interface UseTicketActionsProps {
  onTicketsChanged?: () => void;
  t?: (lvText: string, enText: string) => string;
  userId?: string | null;
  onDelete?: (ticketId: string) => void;
}

export const useTicketActions = (onDelete?: (ticketId: string) => void) => {
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const { toast } = useToast();

  const handleViewTicket = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
  };
  
  const handleDeleteTicket = (ticketId: string) => {
    setTicketToDelete(ticketId);
    setIsConfirmDeleteOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Call the provided onDelete function if available
      if (onDelete) {
        onDelete(ticketToDelete);
      }
      
      setTicketToDelete(null);
      setIsConfirmDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting ticket:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const cancelDelete = () => {
    setTicketToDelete(null);
    setIsConfirmDeleteOpen(false);
  };

  return {
    selectedTicket,
    isDeleting,
    ticketToDelete,
    isConfirmDeleteOpen,
    setIsConfirmDeleteOpen,
    handleViewTicket,
    handleDeleteTicket,
    handleConfirmDelete,
    cancelDelete
  };
};
