
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "@/hooks/tickets";
import { getCategoryIdFromName } from "@/components/events/utils/categoryUtils";

export const useCategoryTickets = (category?: string) => {
  const [availableTickets, setAvailableTickets] = useState<Record<string, UserTicket[]>>({});
  const [allCategoryTickets, setAllCategoryTickets] = useState<UserTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAvailableTickets = async () => {
      try {
        setIsLoading(true);
        
        const categoryId = category ? getCategoryIdFromName(category) : '';
        
        const { data: ticketsData, error: fetchError } = await supabase
          .from('tickets')
          .select('*')
          .eq('status', 'available');
          
        if (category) {
          // Filter by category if provided
          fetchError || await supabase.from('tickets').select('*').eq('category_id', categoryId);
        }
        
        if (fetchError) {
          throw fetchError;
        }
        
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

        // Filter by category if provided
        const categoryTickets = category 
          ? formattedTickets.filter(ticket => ticket.category === getCategoryIdFromName(category))
          : formattedTickets;
        
        // Group tickets by event_id
        const ticketsByEvent: Record<string, UserTicket[]> = {};
        
        categoryTickets.forEach(ticket => {
          const eventId = ticket.event_id || 'unassigned';
          if (!ticketsByEvent[eventId]) {
            ticketsByEvent[eventId] = [];
          }
          
          ticketsByEvent[eventId].push(ticket);
        });
        
        setAvailableTickets(ticketsByEvent);
        setAllCategoryTickets(categoryTickets);
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
    // Remove the purchased ticket from all tickets
    const updatedAllTickets = allCategoryTickets.filter(t => t.id !== ticketId);
    setAllCategoryTickets(updatedAllTickets);
    
    // Update the grouped tickets as well
    const updatedTicketsByEvent = { ...availableTickets };
    
    // Find and remove the ticket from any event group it's in
    Object.keys(updatedTicketsByEvent).forEach(eventId => {
      updatedTicketsByEvent[eventId] = updatedTicketsByEvent[eventId].filter(
        t => t.id !== ticketId
      );
      
      // Remove empty arrays
      if (updatedTicketsByEvent[eventId].length === 0) {
        delete updatedTicketsByEvent[eventId];
      }
    });
    
    setAvailableTickets(updatedTicketsByEvent);
  };

  return {
    availableTickets,
    allCategoryTickets,
    isLoading,
    error,
    removeTicketFromState
  };
};
