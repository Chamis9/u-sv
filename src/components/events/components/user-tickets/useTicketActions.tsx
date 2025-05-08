
import { useState } from 'react';
import { UserTicket } from "@/hooks/tickets";
import { useToast } from "@/hooks/use-toast";
import { deleteTicketMutation } from "@/hooks/tickets/mutations/deleteTicketMutation";

interface UseTicketActionsProps {
  onTicketsChanged?: () => void;
  t: (lvText: string, enText: string) => string;
  userId?: string | null;
}

export const useTicketActions = ({ onTicketsChanged, t, userId }: UseTicketActionsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteClick = (ticketId: string) => {
    setTicketToDelete(ticketId);
  };
  
  const confirmDelete = async () => {
    if (!ticketToDelete || !userId) return;
    
    try {
      setIsDeleting(true);
      
      // Use the direct mutation function
      const success = await deleteTicketMutation(ticketToDelete, userId);
      
      if (success) {
        toast({
          title: t("Biļete dzēsta", "Ticket deleted"),
          description: t("Biļete ir veiksmīgi dzēsta", "Ticket has been successfully deleted")
        });
        
        // Notify parent component to refresh tickets
        if (onTicketsChanged) {
          onTicketsChanged();
        }
      } else {
        toast({
          title: t("Kļūda", "Error"),
          description: t("Neizdevās dzēst biļeti", "Failed to delete ticket"),
          variant: "destructive"
        });
      }
      
      setTicketToDelete(null);
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast({
        title: t("Kļūda", "Error"),
        description: t("Neizdevās dzēst biļeti", "Failed to delete ticket"),
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const cancelDelete = () => {
    setTicketToDelete(null);
  };

  return {
    isDeleting,
    ticketToDelete,
    handleDeleteClick,
    confirmDelete,
    cancelDelete
  };
};
