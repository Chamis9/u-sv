
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
      
      const { data, error } = await supabase
        .from('tickets')
        .select('*, categories(name)')
        .eq('user_id', userId);
      
      if (error) {
        console.error("Error fetching tickets:", error);
        throw error;
      }
      
      console.log("Tickets fetched:", data?.length || 0, "tickets found");
      
      // Transform the data to match UserTicket interface
      return data.map(ticket => ({
        id: ticket.id,
        title: ticket.description || "Custom Ticket",
        description: ticket.description,
        category: ticket.categories?.name || "Other",
        price: ticket.price,
        event_id: ticket.event_id,
        status: ticket.status as 'available' | 'sold' | 'expired',
        file_path: ticket.file_path,
        created_at: ticket.created_at
      })) || [];
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
