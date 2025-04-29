
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "@/hooks/tickets";

export const useCategoryTickets = (category?: string) => {
  const [allCategoryTickets, setAllCategoryTickets] = useState<UserTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAvailableTickets = async () => {
      try {
        setIsLoading(true);
        
        console.log('Fetching tickets for category:', category);
        
        if (!category) {
          console.log('No category provided, returning empty array');
          setAllCategoryTickets([]);
          setIsLoading(false);
          return;
        }
        
        // Query the consolidated tickets table with a filter for category
        const { data: ticketsData, error: fetchError } = await supabase
          .from('tickets')
          .select('*, categories(name)')
          .eq('status', 'available')
          .eq('category_name', category);
        
        if (fetchError) {
          throw fetchError;
        }
        
        console.log(`Fetched ${ticketsData?.length || 0} tickets for category ${category}`);
        
        // Transform the data to match UserTicket type
        const formattedTickets: UserTicket[] = ((ticketsData || []) as any[]).map((ticket: any) => {
          return {
            id: String(ticket.id),
            title: ticket.title || ticket.description || "Ticket",
            description: ticket.description || "",
            category: ticket.category_name || ticket.categories?.name || 'Other',
            price: ticket.price,
            event_id: ticket.event_id || null,
            status: 'available',
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
          };
        });
        
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
