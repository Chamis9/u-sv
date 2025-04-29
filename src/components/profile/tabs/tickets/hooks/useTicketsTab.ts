
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUserTickets, UserTicket, AddTicketData } from "@/hooks/tickets";
import { useLanguage } from "@/features/language";
import { User } from "@/types/users";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useTicketsTab(user: User) {
  const { currentLanguage } = useLanguage();
  const [addTicketOpen, setAddTicketOpen] = useState(false);
  const [editTicketOpen, setEditTicketOpen] = useState(false);
  const [currentEditTicket, setCurrentEditTicket] = useState<UserTicket | null>(null);
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const { 
    tickets, 
    isLoading, 
    loading, 
    deleteTicket,
    updateTicket
  } = useUserTickets(user?.id || '');
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  // Filter tickets based on seller_id and buyer_id
  const addedTickets = tickets.filter(ticket => 
    ticket.seller_id === user?.id
  );
  
  const purchasedTickets = tickets.filter(ticket => 
    ticket.buyer_id === user?.id
  );
  
  console.log("Current auth state:", { isAuthenticated, userId: user?.id });
  console.log("Filtered tickets:", {
    total: tickets.length,
    added: addedTickets.length,
    purchased: purchasedTickets.length,
    ticketDetails: tickets
  });
  
  const handleDeleteTicket = async (ticketId: string) => {
    if (window.confirm(t(
      "Vai tiešām vēlaties dzēst šo biļeti?", 
      "Are you sure you want to delete this ticket?"
    ))) {
      const success = await deleteTicket(ticketId);
      
      if (success) {
        toast({
          title: t("Biļete dzēsta", "Ticket deleted"),
          description: t(
            "Biļete ir veiksmīgi dzēsta", 
            "The ticket has been successfully deleted"
          )
        });
        
        // Refresh tickets list
        queryClient.invalidateQueries({ queryKey: ['user-tickets', user?.id] });
      } else {
        toast({
          title: t("Kļūda", "Error"),
          description: t(
            "Neizdevās dzēst biļeti. Lūdzu mēģiniet vēlreiz.", 
            "Failed to delete the ticket. Please try again."
          ),
          variant: "destructive"
        });
      }
    }
  };

  const handleUpdateTicket = async (ticketId: string, data: Partial<AddTicketData>) => {
    try {
      const { success, ticket, error } = await updateTicket(ticketId, data);
      
      if (success && ticket) {
        toast({
          title: t("Biļete atjaunināta", "Ticket updated"),
          description: t(
            "Biļetes informācija ir veiksmīgi atjaunināta", 
            "Ticket information has been successfully updated"
          )
        });
        
        // Refresh tickets list
        queryClient.invalidateQueries({ queryKey: ['user-tickets', user?.id] });
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

  const refreshTickets = () => {
    console.log("Refreshing tickets for user:", user?.id);
    if (!isAuthenticated) {
      console.log("User not authenticated, cannot refresh tickets");
      toast({
        title: t("Nav pieslēgts", "Not logged in"),
        description: t("Lai redzētu biļetes, lūdzu pieslēdzieties", "Please log in to see tickets"),
        variant: "destructive"
      });
      return;
    }
    
    if (user?.id) {
      queryClient.invalidateQueries({ queryKey: ['user-tickets', user.id] });
      toast({
        title: t("Biļetes atjaunotas", "Tickets refreshed"),
        description: t("Biļešu saraksts ir atjaunots", "Ticket list has been updated")
      });
    }
  };
  
  // Only refresh tickets once when component mounts
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      console.log("Initial ticket refresh for user:", user.id);
      refreshTickets();
    } else {
      console.log("Not authenticated or no user ID, skipping ticket refresh");
    }
  }, [user?.id, isAuthenticated]);
  
  return {
    tickets,
    addedTickets,
    purchasedTickets,
    isLoading,
    loading,
    addTicketOpen,
    setAddTicketOpen,
    editTicketOpen,
    setEditTicketOpen,
    currentEditTicket,
    setCurrentEditTicket,
    handleDeleteTicket,
    handleUpdateTicket,
    refreshTickets,
    t,
    isAuthenticated
  };
}
