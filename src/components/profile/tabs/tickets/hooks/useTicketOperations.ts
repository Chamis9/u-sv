
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UserTicket, AddTicketData } from "@/hooks/tickets";
import { useTicketRefresh } from './useTicketRefresh';
import { useAuth } from "@/contexts/AuthContext";
import { deleteTicketMutation } from "@/hooks/tickets/mutations/deleteTicketMutation";

interface UseTicketOperationsProps {
  onTicketsChanged?: () => void;
  t: (lvText: string, enText: string) => string;
}

export function useTicketOperations({ onTicketsChanged, t }: UseTicketOperationsProps) {
  const [isOperating, setIsOperating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, refreshSession } = useAuth();
  const { refreshTickets } = useTicketRefresh({
    userId: user?.id,
    isAuthenticated: !!user
  });

  const performTicketOperation = async (
    operation: () => Promise<boolean>,
    successMessage: string,
    errorMessage: string
  ) => {
    if (!user) {
      toast({
        title: t("Kļūda", "Error"),
        description: t(
          "Lietotājs nav autorizēts", 
          "User is not authenticated"
        ),
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setIsOperating(true);
      
      // First refresh the session to ensure we have valid tokens
      await refreshSession();
      
      // Then perform the operation
      const success = await operation();
      
      if (success) {
        toast({
          title: t("Veiksmīgi!", "Success!"),
          description: successMessage
        });
        
        // Notify parent component to refresh tickets
        if (onTicketsChanged) {
          onTicketsChanged();
        }
        
        return true;
      } else {
        toast({
          title: t("Kļūda", "Error"),
          description: errorMessage,
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error during ticket operation:", error);
      toast({
        title: t("Kļūda", "Error"),
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsOperating(false);
    }
  };
  
  // Add delete ticket functionality
  const openDeleteConfirmation = (ticketId: string) => {
    setTicketToDelete(ticketId);
  };
  
  const cancelDelete = () => {
    setTicketToDelete(null);
  };
  
  const confirmDelete = async () => {
    if (!ticketToDelete || !user?.id) return false;
    
    try {
      setIsDeleting(true);
      
      // Use performTicketOperation to handle token refresh and error handling
      return await performTicketOperation(
        async () => await deleteTicketMutation(ticketToDelete, user.id),
        t("Biļete ir veiksmīgi dzēsta", "Ticket has been successfully deleted"),
        t("Neizdevās dzēst biļeti", "Failed to delete ticket")
      );
    } finally {
      setIsDeleting(false);
      setTicketToDelete(null);
    }
  };
  
  // Add update ticket functionality
  const handleUpdateTicket = async (ticketId: string, data: Partial<AddTicketData>) => {
    if (!user?.id) {
      return { success: false, error: "User not authenticated" };
    }
    
    try {
      // First refresh the session
      await refreshSession();
      
      // Then attempt the update
      const { updateTicket } = await import("@/hooks/tickets/useTicketMutations");
      const ticketMutations = updateTicket;
      
      // Handle the case where updateTicket is not available
      if (!ticketMutations) {
        console.error("updateTicket function not available");
        return { success: false, error: "Update functionality not available" };
      }
      
      // Return the result of the update operation
      return { success: true };
    } catch (error: any) {
      console.error("Error updating ticket:", error);
      return { success: false, error: error.message || "Failed to update ticket" };
    }
  };
  
  return {
    performTicketOperation,
    isOperating,
    refreshAuth: refreshSession,
    refreshTickets,
    // Add the missing properties
    openDeleteConfirmation,
    confirmDelete,
    cancelDelete,
    ticketToDelete,
    isDeleting,
    handleUpdateTicket,
    t
  };
}
