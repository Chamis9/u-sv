
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "@/hooks/tickets";

export const useTicketById = () => {
  const [ticket, setTicket] = useState<UserTicket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchTicketById = async (id: string) => {
    if (!id) return null;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Query the consolidated tickets table
      const { data, error } = await supabase
        .from('tickets')
        .select('*, categories(name)')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`No ticket found:`, error.message);
        setError(new Error("Ticket not found"));
        setTicket(null);
        return null;
      }
      
      if (data) {
        console.log(`Ticket found:`, data);
        
        // Ensure status is one of the allowed values
        let ticketStatus: 'available' | 'sold' | 'expired' = 'available';
        if (data.status === 'sold' || data.status === 'expired') {
          ticketStatus = data.status;
        }
        
        // Transform to UserTicket format
        const foundTicket: UserTicket = {
          id: String(id),
          title: data.title || data.description || "Ticket",
          description: data.description || undefined,
          category: data.category_name || data.categories?.name || 'Other',
          price: typeof data.price === 'number' ? data.price : 0,
          event_id: data.event_id || null,
          status: ticketStatus,
          file_path: data.file_path || undefined,
          created_at: data.created_at || new Date().toISOString(),
          seller_id: data.seller_id || undefined,
          buyer_id: data.buyer_id || undefined,
          owner_id: data.owner_id || undefined,
          event_date: data.event_date || null,
          venue: data.venue || null,
          quantity: data.quantity || 1,
          price_per_unit: data.price_per_unit || data.price || 0,
          event_time: data.event_time || null
        };
        
        setTicket(foundTicket);
        setIsLoading(false);
        return foundTicket;
      }
      
      // If we get here, no ticket was found
      setError(new Error("Ticket not found"));
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
