
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
        // Query the consolidated tickets table
        const { data: ticketsData, error } = await supabase
          .from('tickets')
          .select('*, categories(name)')
          .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`);
        
        if (error) {
          console.error(`Error fetching tickets:`, error);
          throw error;
        }
        
        if (ticketsData && ticketsData.length > 0) {
          console.log(`Found ${ticketsData.length} tickets`);
          
          // Map to common UserTicket structure
          const formattedTickets = ticketsData.map((ticket: any): UserTicket => ({
            id: String(ticket.id),
            title: ticket.title || ticket.description || "Ticket",
            description: ticket.description || undefined,
            category: ticket.category_name || ticket.categories?.name || 'Other',
            price: ticket.price,
            event_id: ticket.event_id || null,
            status: ticket.buyer_id ? 'sold' : 'available',
            file_path: ticket.file_path || undefined,
            created_at: ticket.created_at,
            seller_id: ticket.seller_id || undefined,
            buyer_id: ticket.buyer_id || undefined,
            owner_id: ticket.owner_id,
            event_date: ticket.event_date || null,
            venue: ticket.venue || null,
            category_name: ticket.category_name
          }));
          
          return formattedTickets;
        }
        
        console.log(`No tickets found for user: ${userId}`);
        return [];
        
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
