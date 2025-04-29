
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { getCategoryTableName } from "@/components/profile/tabs/tickets/services/CategoryService";

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
        // We need to query all category-specific ticket tables
        const ticketTables = [
          'tickets_theatre', 'tickets_concerts', 'tickets_sports', 
          'tickets_festivals', 'tickets_cinema', 'tickets_children', 
          'tickets_travel', 'tickets_giftcards', 'tickets_other'
        ];
        
        let allTickets: UserTicket[] = [];
        
        // Query each table separately and combine results
        for (const tableName of ticketTables) {
          const { data: tableTickets, error } = await supabase
            .from(tableName as any)
            .select('*, categories(name)')
            .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`);
          
          if (error) {
            console.error(`Error fetching tickets from ${tableName}:`, error);
            continue; // Skip this table if there's an error
          }
          
          if (tableTickets && tableTickets.length > 0) {
            console.log(`Found ${tableTickets.length} tickets in ${tableName}`);
            
            // Map to common UserTicket structure
            const formattedTickets = tableTickets.map((ticket: any): UserTicket => ({
              id: String(ticket.id),
              title: ticket.description || "Ticket",
              description: ticket.description || undefined,
              category: ticket.categories?.name || getCategoryNameFromTableName(tableName),
              price: ticket.price,
              event_id: ticket.event_id || null,
              status: ticket.buyer_id ? 'sold' : 'available',
              file_path: ticket.file_path || undefined,
              created_at: ticket.created_at,
              seller_id: ticket.seller_id || undefined,
              buyer_id: ticket.buyer_id || undefined,
              owner_id: ticket.owner_id,
              event_date: ticket.event_date || null,
              venue: ticket.venue || null
            }));
            
            allTickets = [...allTickets, ...formattedTickets];
          }
        }
        
        console.log(`Total tickets fetched: ${allTickets.length} across all tables`);
        return allTickets;
        
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

  // Helper function to derive category name from table name
  function getCategoryNameFromTableName(tableName: string): string {
    const categoryMapping: Record<string, string> = {
      'tickets_theatre': 'Theatre',
      'tickets_concerts': 'Concerts',
      'tickets_sports': 'Sports',
      'tickets_festivals': 'Festivals',
      'tickets_cinema': 'Cinema',
      'tickets_children': 'Children',
      'tickets_travel': 'Travel',
      'tickets_giftcards': 'Gift Cards',
      'tickets_other': 'Other'
    };
    
    return categoryMapping[tableName] || 'Other';
  }

  return {
    tickets,
    isLoading,
    error
  };
}
