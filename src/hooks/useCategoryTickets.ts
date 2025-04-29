
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "@/hooks/tickets";
import { urlToCategoryId } from "@/components/events/utils/categoryUtils";

export const useCategoryTickets = (category?: string) => {
  const [allCategoryTickets, setAllCategoryTickets] = useState<UserTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAvailableTickets = async () => {
      try {
        setIsLoading(true);
        
        if (!category) {
          setAllCategoryTickets([]);
          setIsLoading(false);
          return;
        }
        
        // Normalize category name for comparison (convert to lowercase, handle hyphens, etc)
        const normalizedCategory = category.toLowerCase();
        const internalCategoryId = urlToCategoryId[normalizedCategory] || normalizedCategory;
        
        // Map URL slugs to possible database category names
        const categoryMapping: Record<string, string[]> = {
          'sports': ['Sports', 'sports', 'Sport', 'sport'],
          'teatris': ['Teātris', 'teatris', 'teātris', 'Teatris', 'Theatre'],
          'koncerti': ['Koncerti', 'koncerti', 'Koncerts', 'koncerts', 'Concerts'],
          'festivali': ['Festivāli', 'festivali', 'festivāli', 'Festivali', 'Festivals']
        };
        
        // Get possible category names from mapping or use the original
        const possibleCategories = categoryMapping[normalizedCategory] || [category];
        
        // Query using any of the possible category names
        const { data: ticketsData, error: fetchError } = await supabase
          .from('tickets')
          .select('*, categories(name)')
          .eq('status', 'available')
          .in('category_name', possibleCategories);
        
        if (fetchError) {
          throw fetchError;
        }
        
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
