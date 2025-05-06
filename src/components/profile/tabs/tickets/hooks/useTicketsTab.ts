
import { useState, useEffect, useCallback } from "react";
import { User } from "@/types/users";
import { useUserTickets, UserTicket, AddTicketData } from "@/hooks/tickets";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { useTicketOperations } from "./useTicketOperations";

export function useTicketsTab(user: User) {
  const { isAuthenticated } = useAuth();
  const { currentLanguage } = useLanguage();
  const { tickets, isLoading, refreshTickets, updateTicket } = useUserTickets(user?.id);
  const [addedTickets, setAddedTickets] = useState<UserTicket[]>([]);
  const [purchasedTickets, setPurchasedTickets] = useState<UserTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [addTicketOpen, setAddTicketOpen] = useState(false);
  const [editTicketOpen, setEditTicketOpen] = useState(false);
  const [currentEditTicket, setCurrentEditTicket] = useState<UserTicket | null>(null);

  // Setup ticket operations (delete, update, etc.)
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
    updateTicket
  });
  
  // Sort tickets into added and purchased categories
  useEffect(() => {
    // Skip if not authenticated (prevents premature data fetching)
    if (!isAuthenticated) {
      return;
    }
    
    const filterTickets = () => {
      const added: UserTicket[] = [];
      const purchased: UserTicket[] = [];
      
      if (!tickets || !user?.id) {
        return { added, purchased };
      }
      
      tickets.forEach(ticket => {
        if (ticket.seller_id === user.id) {
          added.push(ticket);
        } else if (ticket.buyer_id === user.id) {
          purchased.push(ticket);
        }
      });
      
      // Sort tickets by creation date (newest first)
      return {
        added: added.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
        purchased: purchased.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      };
    };
    
    const { added, purchased } = filterTickets();
    setAddedTickets(added);
    setPurchasedTickets(purchased);
  }, [tickets, user?.id, isAuthenticated]);

  return {
    addedTickets,
    purchasedTickets,
    isLoading: isLoading || loading,
    loading,
    addTicketOpen,
    setAddTicketOpen,
    openDeleteConfirmation,
    confirmDelete,
    cancelDelete,
    ticketToDelete,
    isDeleting,
    handleUpdateTicket,
    refreshTickets,
    editTicketOpen,
    setEditTicketOpen,
    currentEditTicket,
    setCurrentEditTicket,
    t,
    isAuthenticated
  };
}
