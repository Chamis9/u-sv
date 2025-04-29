
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "@/hooks/tickets";
import { getCategoryIdFromName } from "@/components/events/utils/categoryUtils";

export const useCategoryTickets = (category?: string) => {
  const [allCategoryTickets, setAllCategoryTickets] = useState<UserTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAvailableTickets = async () => {
      try {
        setIsLoading(true);
        
        console.log('Fetching tickets for category:', category);
        
        // Determine which table to query based on the category
        let tableName: 'tickets' | 'tickets_theatre' | 'tickets_concerts' | 'tickets_sports' | 'tickets_festivals' | 'tickets_other' = 'tickets';
        
        if (category) {
          const normalizedCategory = category.toLowerCase();
          
          if (normalizedCategory === 'teātris' || normalizedCategory === 'theatre') {
            tableName = 'tickets_theatre';
          } else if (normalizedCategory === 'koncerti' || normalizedCategory === 'concerts') {
            tableName = 'tickets_concerts';
          } else if (normalizedCategory === 'sports') {
            tableName = 'tickets_sports';
          } else if (normalizedCategory === 'festivāli' || normalizedCategory === 'festivals') {
            tableName = 'tickets_festivals';
          } else {
            tableName = 'tickets_other';
          }
        }
        
        console.log(`Using table ${tableName} for category: ${category}`);
        
        // Query the appropriate table
        const { data: ticketsData, error: fetchError } = await supabase
          .from(tableName)
          .select('*, categories(name)')
          .eq('status', 'available');
        
        if (fetchError) {
          throw fetchError;
        }
        
        console.log('Fetched tickets:', ticketsData);
        
        // Transform the data to match UserTicket type
        const formattedTickets: UserTicket[] = (ticketsData || []).map(ticket => ({
          id: ticket.id as string, // Ensure id is a string
          title: ticket.description || "Ticket",
          description: ticket.description,
          category: ticket.category_id || "",
          price: ticket.price,
          event_id: ticket.event_id,
          status: 'available' as const,
          file_path: ticket.file_path,
          created_at: ticket.created_at,
          seller_id: ticket.seller_id,
          buyer_id: ticket.buyer_id,
          owner_id: ticket.owner_id,
          event_date: ticket.event_date
        }));
        
        setAllCategoryTickets(formattedTickets);
      } catch (err) {
        console.error('Error fetching available tickets:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch tickets'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailableTickets();
  }, [category]);

  // Function to update state after ticket purchase
  const removeTicketFromState = (ticketId: string) => {
    setAllCategoryTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  return {
    allCategoryTickets,
    isLoading,
    error,
    removeTicketFromState
  };
};
