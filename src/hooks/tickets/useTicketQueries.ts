
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { useRef } from "react";

export function useTicketQueries(userId?: string) {
  const { isAuthenticated } = useAuth();
  const initialFetchDone = useRef(false);
  
  // Fetch user tickets with enhanced error handling and caching
  const { data: tickets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['user-tickets', userId],
    queryFn: async (): Promise<UserTicket[]> => {
      if (!isAuthenticated) {
        console.log("User not authenticated, returning empty array");
        return [];
      }
      
      try {
        // Avoid logging on every query attempt to reduce console noise
        if (!initialFetchDone.current) {
          console.log(`Initial tickets load for authenticated user: ${userId}`);
          initialFetchDone.current = true;
        }
        
        // First verify the auth session is valid
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session.session) {
          console.error("Authentication session error:", sessionError);
          throw new Error("Authentication session is invalid");
        }
        
        // Use the authenticated user ID for the query to ensure RLS policies work correctly
        const authUserId = session.session.user.id;
        
        // Query the tickets table with enhanced filters to get the user's tickets
        const { data: ticketsData, error } = await supabase
          .from('tickets')
          .select('*, categories(name)')
          .or(`seller_id.eq.${authUserId},buyer_id.eq.${authUserId},owner_id.eq.${authUserId}`)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error(`Error fetching tickets:`, error);
          throw error;
        }
        
        if (ticketsData && ticketsData.length > 0) {
          console.log(`Found ${ticketsData.length} tickets for user ${authUserId}`);
          
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
            quantity: ticket.quantity || 1,
            price_per_unit: ticket.price_per_unit || ticket.price || 0,
            event_time: ticket.event_time || null
          }));
          
          return formattedTickets;
        }
        
        return [];
        
      } catch (error) {
        console.error("Error in useTicketQueries:", error);
        throw error;
      }
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes - dramatically increase stale time
    gcTime: 1000 * 60 * 30, // 30 minutes - keep in cache longer
    retry: 1, // Only retry once
    refetchOnMount: 'stale',
    refetchOnWindowFocus: false, // Disable automatic refetch on window focus
    refetchInterval: false // Disable polling
  });

  // Function to force refresh tickets
  const refreshTickets = async () => {
    console.log("Manually refreshing tickets via useTicketQueries...");
    return await refetch();
  };

  return {
    tickets,
    isLoading,
    error,
    refreshTickets
  };
}
