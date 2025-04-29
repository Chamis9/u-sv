
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "@/hooks/tickets";
import { getCategoryNameFromTableName } from "@/utils/categoryMapping";

export const useTicketById = () => {
  const [ticket, setTicket] = useState<UserTicket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchTicketById = async (id: string) => {
    if (!id) return null;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // List of all ticket tables to search
      const ticketTables = [
        'tickets_theatre', 'tickets_concerts', 'tickets_sports', 
        'tickets_festivals', 'tickets_cinema', 'tickets_children', 
        'tickets_travel', 'tickets_giftcards', 'tickets_other'
      ];
      
      // Search each table for the ticket ID
      for (const tableName of ticketTables) {
        try {
          // Use type assertion to satisfy TypeScript
          const { data, error } = await supabase
            .from(tableName as any)
            .select('*, categories(name)')
            .eq('id', id)
            .single();
          
          if (error) {
            console.log(`No ticket found in ${tableName}:`, error.message);
            continue;
          }
          
          if (data) {
            console.log(`Ticket found in ${tableName}:`, data);
            
            // Transform to UserTicket format with proper type handling
            const foundTicket: UserTicket = {
              id: String(data.id),
              title: data.description || "Ticket",
              description: data.description || undefined,
              category: data.categories?.name || getCategoryNameFromTableName(tableName),
              price: data.price,
              event_id: data.event_id,
              status: (data.status as 'available' | 'sold') || 'available',
              file_path: data.file_path,
              created_at: data.created_at,
              seller_id: data.seller_id,
              buyer_id: data.buyer_id,
              owner_id: data.owner_id,
              event_date: data.event_date || null,
              venue: data.venue || null
            };
            
            setTicket(foundTicket);
            setIsLoading(false);
            return foundTicket;
          }
        } catch (tableError) {
          console.error(`Error searching in ${tableName}:`, tableError);
          // Continue to next table if one fails
        }
      }
      
      // If we get here, no ticket was found
      setError(new Error("Ticket not found in any table"));
      setTicket(null);
      return null;
      
    } catch (err) {
      console.error("Error in searchTicketById:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setTicket(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ticket,
    isLoading,
    error,
    searchTicketById
  };
};

// Helper function to get category name from table name
export const getCategoryNameFromTableName = (tableName: string): string => {
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
};
