
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "@/hooks/tickets";
import { getCategoryTableName } from "@/components/profile/tabs/tickets/services/CategoryService";

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
        let tableName = 'tickets_other';
        
        if (category) {
          tableName = getCategoryTableName(category);
        }
        
        // Validate table name to match allowed table names in Supabase
        const validTableNames = [
          'tickets_theatre', 'tickets_concerts', 'tickets_sports', 
          'tickets_festivals', 'tickets_cinema', 'tickets_children', 
          'tickets_travel', 'tickets_giftcards', 'tickets_other'
        ];
        
        if (!validTableNames.includes(tableName)) {
          console.error(`Invalid table name: ${tableName}`);
          throw new Error(`Invalid category: ${category}`);
        }
        
        console.log(`Using table ${tableName} for category: ${category}`);
        
        // Query the appropriate table using the validated table name
        const { data: ticketsData, error: fetchError } = await supabase
          .from(tableName as any)
          .select('*, categories(name)')
          .eq('status', 'available');
        
        if (fetchError) {
          throw fetchError;
        }
        
        console.log('Fetched tickets:', ticketsData);
        
        // Transform the data to match UserTicket type, handling potential missing fields
        const formattedTickets: UserTicket[] = (ticketsData || []).map((ticket: any) => {
          // Create a base ticket object with properties that should exist in all tables
          const baseTicket: UserTicket = {
            id: String(ticket.id), // Ensure id is a string
            title: ticket.description || "Ticket",
            description: ticket.description || "",
            category: "", // Will be populated below if available
            price: ticket.price,
            event_id: ticket.event_id || null,
            status: 'available' as const,
            file_path: ticket.file_path || undefined,
            created_at: ticket.created_at,
            seller_id: ticket.seller_id || undefined,
            buyer_id: ticket.buyer_id || undefined,
            owner_id: ticket.owner_id,
            event_date: null, // Default value
            venue: ticket.venue || null // Add venue property
          };
          
          // Handle optional category_id if available
          if ('category_id' in ticket) {
            baseTicket.category = ticket.category_id || "";
          }
          
          // Handle event_date if available
          if ('event_date' in ticket) {
            baseTicket.event_date = ticket.event_date || null;
          }
          
          return baseTicket;
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
