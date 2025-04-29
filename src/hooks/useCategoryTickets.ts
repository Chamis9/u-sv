
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
        
        let query = supabase
          .from('tickets')
          .select('*, categories(name)')
          .eq('status', 'available');
          
        // Only filter by category if one is provided
        if (category) {
          // Get the normalized category ID
          const categoryId = getCategoryIdFromName(category);
          console.log('Normalized category ID:', categoryId);
          
          if (categoryId) {
            query = query.eq('category_id', categoryId);
          }
        }
        
        const { data: ticketsData, error: fetchError } = await query;
        
        if (fetchError) {
          throw fetchError;
        }
        
        console.log('Fetched tickets:', ticketsData);
        
        // Transform the data to match UserTicket type
        const formattedTickets: UserTicket[] = (ticketsData || []).map(ticket => ({
          id: ticket.id,
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
          owner_id: ticket.owner_id
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
