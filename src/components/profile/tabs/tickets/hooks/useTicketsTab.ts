
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUserTickets } from "@/hooks/tickets";
import { useLanguage } from "@/features/language";
import { User } from "@/types/users";

export function useTicketsTab(user: User) {
  const { currentLanguage } = useLanguage();
  const [addTicketOpen, setAddTicketOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { 
    tickets, 
    isLoading, 
    loading, 
    deleteTicket 
  } = useUserTickets(user.id);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const listedTickets = tickets.filter(ticket => 
    ticket.status === 'available' || ticket.status === 'expired'
  );
  
  const soldTickets = tickets.filter(ticket => 
    ticket.status === 'sold'
  );
  
  const purchasedTickets = tickets.filter(ticket => 
    ticket.status === 'purchased'
  );
  
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
    queryClient.invalidateQueries({ queryKey: ['user-tickets', user.id] });
  };
  
  // Automatically refresh tickets when component mounts
  useEffect(() => {
    refreshTickets();
  }, []);
  
  return {
    tickets,
    listedTickets,
    soldTickets,
    purchasedTickets,
    isLoading,
    loading,
    addTicketOpen,
    setAddTicketOpen,
    handleDeleteTicket,
    refreshTickets,
    t
  };
}
