
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "./types";

export function useTicketQueries(userId?: string) {
  // Fetch user tickets with enhanced error handling
  const { data: tickets = [], isLoading, error } = useQuery({
    queryKey: ['user-tickets', userId],
    queryFn: async (): Promise<UserTicket[]> => {
      if (!userId) return [];
      
      console.log("Fetching tickets for user:", userId);
      
      // Get tickets where the user is the seller (created tickets)
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
        // Continue with just the created tickets if there's an error
      }
      
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
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  return {
    tickets,
    isLoading,
    error
  };
}
