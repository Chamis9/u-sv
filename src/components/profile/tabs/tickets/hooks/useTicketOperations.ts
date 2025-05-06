
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UserTicket, AddTicketData } from "@/hooks/tickets";
import { useLanguage } from "@/features/language";
import { useToast } from "@/hooks/use-toast";
import { deleteTicketMutation } from "@/hooks/tickets/mutations/deleteTicketMutation";

interface UseTicketOperationsProps {
  userId: string;
  deleteTicket?: (ticketId: string) => Promise<boolean>;
  updateTicket: (ticketId: string, data: Partial<AddTicketData>) => Promise<{
    success: boolean;
    ticket?: UserTicket;
    error?: string;
  }>;
}

export function useTicketOperations({
  userId,
  deleteTicket,
  updateTicket
}: UseTicketOperationsProps) {
  const { currentLanguage } = useLanguage();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const openDeleteConfirmation = (ticketId: string) => {
    console.log(`Opening delete confirmation dialog for ticket: ${ticketId}`);
    setTicketToDelete(ticketId);
  };
  
  const cancelDelete = () => {
    console.log('Delete operation canceled');
    setTicketToDelete(null);
  };
  
  const confirmDelete = async () => {
    if (!ticketToDelete || !userId) {
      console.error('Missing ticketId or userId for ticket deletion');
      toast({
        title: t("Kļūda", "Error"),
        description: t(
          "Neizdevās dzēst biļeti. Nepietiekama informācija.", 
          "Failed to delete the ticket. Insufficient information."
        ),
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setIsDeleting(true);
      console.log(`Attempting to delete ticket: ${ticketToDelete} for user: ${userId}`);
      
      // Use the direct deletion function or the provided one
      const success = deleteTicket 
        ? await deleteTicket(ticketToDelete)
        : await deleteTicketMutation(ticketToDelete, userId);
      
      if (success) {
        toast({
          title: t("Biļete dzēsta", "Ticket deleted"),
          description: t(
            "Biļete ir veiksmīgi dzēsta", 
            "The ticket has been successfully deleted"
          )
        });
        
        // Force invalidate the tickets query to refresh UI
        console.log('Invalidating tickets query after deletion');
        await queryClient.invalidateQueries({ 
          queryKey: ['user-tickets', userId]
        });
        
        // Force refetch to update UI immediately
        await queryClient.refetchQueries({
          queryKey: ['user-tickets', userId],
          exact: true
        });
        
        setTicketToDelete(null);
        return true;
      } else {
        toast({
          title: t("Kļūda", "Error"),
          description: t(
            "Neizdevās dzēst biļeti. Mēģiniet vēlreiz.", 
            "Failed to delete the ticket. Please try again."
          ),
          variant: "destructive"
        });
        return false;
      }
    } catch (err) {
      console.error('Error in confirmDelete:', err);
      toast({
        title: t("Kļūda", "Error"),
        description: t(
          "Neizdevās dzēst biļeti. Lūdzu mēģiniet vēlreiz.", 
          "Failed to delete the ticket. Please try again."
        ),
        variant: "destructive"
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateTicket = async (ticketId: string, data: Partial<AddTicketData>) => {
    try {
      console.log("Starting ticket update with data:", data);
      
      // Make sure we have a valid user ID
      if (!userId) {
        throw new Error("User ID is required for updating tickets");
      }
      
      // Call the update function with logging
      console.log(`Calling updateTicket for ticket ${ticketId} with user ${userId}`);
      const { success, ticket, error } = await updateTicket(ticketId, data);
      
      console.log("Update result:", { success, ticket, error });
      
      if (success && ticket) {
        toast({
          title: t("Biļete atjaunināta", "Ticket updated"),
          description: t(
            "Biļetes informācija ir veiksmīgi atjaunināta", 
            "Ticket information has been successfully updated"
          )
        });
        
        // Refresh tickets list to update UI
        await queryClient.invalidateQueries({ queryKey: ['user-tickets', userId] });
        return { success: true };
      } else {
        toast({
          title: t("Kļūda", "Error"),
          description: error || t(
            "Neizdevās atjaunināt biļeti. Lūdzu mēģiniet vēlreiz.", 
            "Failed to update the ticket. Please try again."
          ),
          variant: "destructive"
        });
        return { success: false, error };
      }
    } catch (err: any) {
      console.error("Error in handleUpdateTicket:", err);
      toast({
        title: t("Kļūda", "Error"),
        description: err.message || t(
          "Neizdevās atjaunināt biļeti. Lūdzu mēģiniet vēlreiz.", 
          "Failed to update the ticket. Please try again."
        ),
        variant: "destructive"
      });
      return { success: false, error: err.message };
    }
  };
  
  return {
    openDeleteConfirmation,
    confirmDelete,
    cancelDelete,
    ticketToDelete,
    isDeleting,
    handleUpdateTicket,
    t
  };
}
