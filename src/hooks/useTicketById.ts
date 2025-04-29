
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
            
            // Make sure we have a valid data object before accessing its properties
            // Use type assertion to help TypeScript understand what we're working with
            const validData = data as Record<string, any>;
            
            // Transform to UserTicket format with proper type handling and type guards
            const foundTicket: UserTicket = {
              id: String(id), // Use the passed id instead of data.id to avoid type errors
              title: validData.description ? String(validData.description) : "Ticket",
              description: validData.description ? String(validData.description) : undefined,
              category: validData.categories?.name || getCategoryNameFromTableName(tableName),
              price: typeof validData.price === 'number' ? validData.price : 0,
              event_id: validData.event_id ? String(validData.event_id) : undefined,
              status: (validData.status as 'available' | 'sold') || 'available',
              file_path: validData.file_path ? String(validData.file_path) : undefined,
              created_at: validData.created_at ? String(validData.created_at) : new Date().toISOString(),
              seller_id: validData.seller_id ? String(validData.seller_id) : undefined,
              buyer_id: validData.buyer_id ? String(validData.buyer_id) : undefined,
              owner_id: validData.owner_id ? String(validData.owner_id) : undefined,
              event_date: validData.event_date || null,
              venue: validData.venue || null
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
