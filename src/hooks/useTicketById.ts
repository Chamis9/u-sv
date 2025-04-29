
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "@/hooks/tickets";

/**
 * Hook to fetch a single ticket by ID regardless of which category table it's in
 * @param ticketId The ID of the ticket to fetch
 * @returns The ticket data and loading state
 */
export const useTicketById = (ticketId?: string) => {
  const [ticket, setTicket] = useState<UserTicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sourceTable, setSourceTable] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Searching for ticket with ID:', ticketId);
        
        // Define all possible ticket tables
        const ticketTables = [
          'tickets_theatre', 'tickets_concerts', 'tickets_sports', 
          'tickets_festivals', 'tickets_cinema', 'tickets_children', 
          'tickets_travel', 'tickets_giftcards', 'tickets_other'
        ];
        
        // Search through each table until we find the ticket
        for (const tableName of ticketTables) {
          const { data, error } = await supabase
            .from(tableName as any)
            .select('*, categories(name)')
            .eq('id', ticketId)
            .maybeSingle();
          
          if (error) {
            console.error(`Error searching in ${tableName}:`, error);
            continue;
          }
          
          if (data) {
            console.log(`Found ticket in ${tableName}:`, data);
            setSourceTable(tableName);
            
            // Format the ticket to match UserTicket type
            const formattedTicket: UserTicket = {
              id: String(data.id),
              title: data.description || "Ticket",
              description: data.description || undefined,
              category: data.categories?.name || getCategoryNameFromTableName(tableName),
              price: data.price,
              event_id: data.event_id || null,
              status: data.status || 'available',
              file_path: data.file_path || undefined,
              created_at: data.created_at,
              seller_id: data.seller_id || undefined,
              buyer_id: data.buyer_id || undefined,
              owner_id: data.owner_id,
              event_date: data.event_date || null,
              venue: data.venue || null
            };
            
            setTicket(formattedTicket);
            setIsLoading(false);
            return;
          }
        }
        
        // If we get here, we didn't find the ticket
        console.log('Ticket not found in any table');
        setIsLoading(false);
        
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch ticket'));
        setIsLoading(false);
      }
    };
    
    fetchTicket();
  }, [ticketId]);

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
    ticket,
    isLoading,
    error,
    sourceTable
  };
};
