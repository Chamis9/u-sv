
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "./types";

export function useTicketQueries(userId?: string) {
  // Fetch user tickets with enhanced error handling
  const { data: tickets = [], isLoading, error } = useQuery({
    queryKey: ['user-tickets', userId],
    queryFn: async (): Promise<UserTicket[]> => {
      if (!userId) {
        console.log("No user ID provided, returning empty array");
        return [];
      }
      
      console.log("Fetching tickets for user:", userId);
      
      try {
        // Get tickets where the user is the seller (added tickets)
        const { data: createdTickets, error: createdError } = await supabase
          .from('tickets')
          .select('*, categories(name)')
          .eq('seller_id', userId);
        
        if (createdError) {
          console.error("Error fetching created tickets:", createdError);
          throw createdError;
        }
        
        // Get tickets purchased by this user
        const { data: purchasedTickets, error: purchasedError } = await supabase
          .from('tickets')
          .select('*, categories(name)')
          .eq('buyer_id', userId);
        
        if (purchasedError) {
          console.error("Error fetching purchased tickets:", purchasedError);
          throw purchasedError;
        }
        
        console.log("Raw ticket data:", {
          created: createdTickets,
          purchased: purchasedTickets
        });
        
        // Process created tickets
        const createdTicketsFormatted: UserTicket[] = (createdTickets || []).map(ticket => ({
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
        
        // Process purchased tickets
        const purchasedTicketsFormatted: UserTicket[] = (purchasedTickets || []).map(ticket => ({
          id: ticket.id,
          title: ticket.description || "Custom Ticket",
          description: ticket.description,
          category: ticket.categories?.name || "Other",
          price: ticket.price,
          event_id: ticket.event_id,
          status: 'purchased',
          file_path: ticket.file_path,
          created_at: ticket.created_at,
          seller_id: ticket.seller_id,
          buyer_id: ticket.buyer_id,
          owner_id: ticket.owner_id
        }));
        
        // Combine both sets
        const allTickets: UserTicket[] = [
          ...createdTicketsFormatted,
          ...purchasedTicketsFormatted
        ];
        
        console.log(`Tickets fetched: ${allTickets.length} total tickets found`);
        console.log(`- ${createdTicketsFormatted.length} created tickets`);
        console.log(`- ${purchasedTicketsFormatted.length} purchased tickets`);
        
        return allTickets;
      } catch (error) {
        console.error("Error in useTicketQueries:", error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds - more frequent refreshes to ensure up-to-date data
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  return {
    tickets,
    isLoading,
    error
  };
}
