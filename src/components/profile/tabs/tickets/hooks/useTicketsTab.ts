
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUserTickets } from "@/hooks/tickets";
import { useLanguage } from "@/features/language";
import { User } from "@/types/users";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useTicketsTab(user: User) {
  const { currentLanguage } = useLanguage();
  const [addTicketOpen, setAddTicketOpen] = useState(false);
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const { 
    tickets, 
    isLoading, 
    loading, 
    deleteTicket 
  } = useUserTickets(user.id);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  // Filter tickets based on seller_id and buyer_id
  const addedTickets = tickets.filter(ticket => 
    ticket.seller_id === user.id
  );
  
  const purchasedTickets = tickets.filter(ticket => 
    ticket.buyer_id === user.id
  );
  
  console.log("Current auth state:", { isAuthenticated, userId: user.id });
  console.log("Filtered tickets:", {
    total: tickets.length,
    added: addedTickets.length,
    purchased: purchasedTickets.length,
    ticketDetails: tickets
  });
  
  const handleDeleteTicket = (ticketId: string) => {
    if (window.confirm(t(
      "Vai tiešām vēlaties dzēst šo biļeti?", 
      "Are you sure you want to delete this ticket?"
    ))) {
      deleteTicket(ticketId);
    }
  };

  const refreshTickets = () => {
    console.log("Refreshing tickets for user:", user.id);
    if (!isAuthenticated) {
      console.log("User not authenticated, cannot refresh tickets");
      toast({
        title: t("Nav pieslēgts", "Not logged in"),
        description: t("Lai redzētu biļetes, lūdzu pieslēdzieties", "Please log in to see tickets"),
        variant: "destructive"
      });
      return;
    }
    
    queryClient.invalidateQueries({ queryKey: ['user-tickets', user.id] });
    toast({
      title: t("Biļetes atjaunotas", "Tickets refreshed"),
      description: t("Biļešu saraksts ir atjaunots", "Ticket list has been updated")
    });
  };
  
  // Automatically refresh tickets when component mounts and every 30 seconds
  useEffect(() => {
    if (isAuthenticated && user.id) {
      console.log("Setting up ticket refresh for user:", user.id);
      refreshTickets();
      
      // Set up periodic refresh
      const intervalId = setInterval(() => {
        refreshTickets();
      }, 30000); // 30 seconds
      
      return () => {
        clearInterval(intervalId);
      };
    } else {
      console.log("Not authenticated or no user ID, skipping ticket refresh");
    }
  }, [user.id, isAuthenticated]);
  
  return {
    tickets,
    addedTickets,
    purchasedTickets,
    isLoading,
    loading,
    addTicketOpen,
    setAddTicketOpen,
    handleDeleteTicket,
    refreshTickets,
    t,
    isAuthenticated
  };
}
