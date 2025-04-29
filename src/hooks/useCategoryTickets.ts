
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "@/hooks/tickets";
import { getCategoryTableName, getCategoryNameFromTableName } from "@/utils/categoryMapping";

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
        
        // Determine which table to query based on the category
        const tableName = getCategoryTableName(category);
        
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
        
        // Query ONLY the appropriate table for this category
        const { data: ticketsData, error: fetchError } = await supabase
          .from(tableName as any)
          .select('*, categories(name)')
          .eq('status', 'available');
        
        if (fetchError) {
          throw fetchError;
        }
        
        console.log(`Fetched ${ticketsData?.length || 0} tickets for category ${category}`);
        
        // Transform the data to match UserTicket type, handling potential missing fields
        const formattedTickets: UserTicket[] = ((ticketsData || []) as any[]).map((ticket: any) => {
          const categoryName = ticket.categories?.name || getCategoryNameFromTableName(tableName);
          
          // Create a base ticket object with properties that should exist in all tables
          const baseTicket: UserTicket = {
            id: String(ticket.id), // Ensure id is a string
            title: ticket.description || "Ticket",
            description: ticket.description || "",
            category: categoryName, // Use the category name from the database or derived from table name
            price: ticket.price,
            event_id: ticket.event_id || null,
            status: 'available' as const,
            file_path: ticket.file_path || undefined,
            created_at: ticket.created_at,
            seller_id: ticket.seller_id || undefined,
            buyer_id: ticket.buyer_id || undefined,
            owner_id: ticket.owner_id,
            event_date: ticket.event_date || null,
            venue: ticket.venue || null
          };
          
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
