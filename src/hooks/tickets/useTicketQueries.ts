
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "./types";
import { useAuth } from "@/contexts/AuthContext";

export function useTicketQueries(userId?: string) {
  const { isAuthenticated } = useAuth();
  
  // Fetch user tickets with enhanced error handling
  const { data: tickets = [], isLoading, error } = useQuery({
    queryKey: ['user-tickets', userId],
    queryFn: async (): Promise<UserTicket[]> => {
      if (!userId) {
        console.log("No user ID provided, returning empty array");
        return [];
      }
      
      if (!isAuthenticated) {
        console.log("User not authenticated, returning empty array");
        return [];
      }
      
      console.log("Fetching tickets for user:", userId);
      
      try {
        // Thanks to RLS, this will only return tickets where the user is seller_id or buyer_id
        const { data: tickets, error } = await supabase
          .from('tickets')
          .select('*, categories(name)')
          .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`);
        
        if (error) {
          console.error("Error fetching tickets:", error);
          throw error;
        }
        
        console.log("Raw ticket data:", tickets);
        
        // Process tickets with consistent format
        const formattedTickets: UserTicket[] = (tickets || []).map(ticket => ({
          id: ticket.id,
          title: ticket.description || "Custom Ticket",
          description: ticket.description,
          category: ticket.categories?.name || "Other",
          price: ticket.price,
          event_id: ticket.event_id,
          status: ticket.buyer_id ? 'sold' : 'available',
          file_path: ticket.file_path,
          created_at: ticket.created_at,
          seller_id: ticket.seller_id,
          buyer_id: ticket.buyer_id,
          owner_id: ticket.owner_id
        }));
        
        console.log(`Tickets fetched: ${formattedTickets.length} total tickets found`);
        
        return formattedTickets;
      } catch (error) {
        console.error("Error in useTicketQueries:", error);
        throw error;
      }
    },
    enabled: !!userId && isAuthenticated,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  return {
    tickets,
    isLoading,
    error
  };
}
