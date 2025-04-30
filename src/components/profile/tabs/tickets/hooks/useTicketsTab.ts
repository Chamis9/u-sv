
import { useEffect } from "react";
import { useUserTickets } from "@/hooks/tickets";
import { useLanguage } from "@/features/language";
import { User } from "@/types/users";
import { useAuth } from "@/contexts/AuthContext";
import { useTicketDialogs } from "./useTicketDialogs";
import { useTicketOperations } from "./useTicketOperations";
import { useTicketRefresh } from "./useTicketRefresh";

export function useTicketsTab(user: User) {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  // Custom hooks
  const { 
    addTicketOpen, 
    setAddTicketOpen,
    editTicketOpen,
    setEditTicketOpen,
    currentEditTicket,
    setCurrentEditTicket,
    openEditTicketDialog
  } = useTicketDialogs();
  
  const { 
    tickets, 
    isLoading, 
    loading, 
    deleteTicket,
    updateTicket
  } = useUserTickets(user?.id || '');
  
  const { 
    openDeleteConfirmation, 
    confirmDelete, 
    cancelDelete, 
    ticketToDelete, 
    isDeleting, 
    handleUpdateTicket, 
    t 
  } = useTicketOperations({
    userId: user?.id || '',
    deleteTicket,
    updateTicket
  });
  
  const { refreshTickets } = useTicketRefresh({ 
    userId: user?.id, 
    isAuthenticated 
  });
  
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
    openDeleteConfirmation,
    confirmDelete,
    cancelDelete,
    ticketToDelete,
    isDeleting,
    handleUpdateTicket,
    refreshTickets,
    t,
    isAuthenticated,
    // Helper function to open edit dialog
    onEdit: openEditTicketDialog
  };
}
