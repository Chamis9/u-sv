
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
        
        const categoryId = category ? getCategoryIdFromName(category) : '';
        
        let query = supabase
          .from('tickets')
          .select('*')
          .eq('status', 'available');
          
        if (category && categoryId) {
          // Filter by category if provided - make sure to filter by the right field
          query = query.eq('category_id', categoryId);
        }
        
        const { data: ticketsData, error: fetchError } = await query;
        
        if (fetchError) {
          throw fetchError;
        }
        
        console.log('Fetched tickets for category:', category, 'categoryId:', categoryId, 'count:', ticketsData?.length);
        
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
