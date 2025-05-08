
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UserTicket, AddTicketData } from "@/hooks/tickets";
import { useTicketRefresh } from './useTicketRefresh';
import { useAuth } from "@/contexts/AuthContext";
import { deleteTicketMutation } from "@/hooks/tickets/mutations/deleteTicketMutation";
import { updateTicketMutation } from "@/hooks/tickets/mutations/updateTicketMutation";
import { supabase } from "@/integrations/supabase/client";

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

  // Debug user information to help diagnose the issue
  if (user) {
    console.log("Current user in useTicketOperations:", {
      id: user.id,
      email: user.email
    });
  }

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
      console.log("Refreshing auth session before operation");
      await refreshSession();
      
      // Get the current session to use the correct auth user ID
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('No valid authentication session found');
      }
      
      const authUserId = sessionData.session?.user.id;
      console.log("Performing ticket operation with auth user ID:", authUserId);
      
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
    } catch (error: any) {
      console.error("Error during ticket operation:", error);
      toast({
        title: t("Kļūda", "Error"),
        description: errorMessage + (error.message ? `: ${error.message}` : ''),
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
      
      // First refresh the session to ensure valid tokens
      console.log("Refreshing auth session before delete operation");
      await refreshSession();
      
      // Get the current session to use the correct auth user ID
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('No valid authentication session found');
      }
      
      const authUserId = sessionData.session?.user.id;
      console.log("Deleting ticket with auth user ID:", authUserId);
      
      // Use performTicketOperation to handle token refresh and error handling
      return await performTicketOperation(
        async () => await deleteTicketMutation(ticketToDelete, authUserId),
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
      console.log("Refreshing auth session before update operation");
      await refreshSession();
      
      // Get the current session to use the correct auth user ID
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        return { success: false, error: 'No valid authentication session found' };
      }
      
      const authUserId = sessionData.session?.user.id;
      console.log("Updating ticket with auth user ID:", authUserId);
      
      // Directly use the updateTicketMutation that we imported
      const result = await updateTicketMutation(ticketId, data, authUserId);
      
      if (result.success && onTicketsChanged) {
        // If update was successful, refresh the tickets list
        onTicketsChanged();
      }
      
      return result;
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
    // Return the delete and update functionality
    openDeleteConfirmation,
    confirmDelete,
    cancelDelete,
    ticketToDelete,
    isDeleting,
    handleUpdateTicket,
    t
  };
}
