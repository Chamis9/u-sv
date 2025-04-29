
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AddTicketData, UserTicket } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { safeConvertJsonArrayToActivities } from '@/components/admin/activity/types';
import { Json } from '@/integrations/supabase/types';

export function useTicketMutations(userId?: string) {
  const [loading, setLoading] = useState(false);
  
  const getCategoryTableName = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'Theatre': 'tickets_theatre',
      'Teātris': 'tickets_theatre',
      'Concerts': 'tickets_concerts',
      'Koncerti': 'tickets_concerts',
      'Sports': 'tickets_sports',
      'Festivals': 'tickets_festivals',
      'Festivāli': 'tickets_festivals',
      'Cinema': 'tickets_cinema',
      'Kino': 'tickets_cinema',
      'Children': 'tickets_children',
      'Bērniem': 'tickets_children',
      'Travel': 'tickets_travel',
      'Ceļojumi': 'tickets_travel',
      'Gift Cards': 'tickets_giftcards',
      'Dāvanu kartes': 'tickets_giftcards',
      'Other': 'tickets_other',
      'Citi': 'tickets_other'
    };
    
    return categoryMap[category] || 'tickets_other';
  };
  
  // Add a new ticket
  const addTicket = async (data: AddTicketData): Promise<{ success: boolean; ticket?: UserTicket; error?: string }> => {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    try {
      const ticketId = uuidv4();
      const tableName = getCategoryTableName(data.category_name || 'Other');
      
      // Insert ticket into the right table
      const { data: responseData, error } = await supabase
        .from(tableName as any)
        .insert({
          id: ticketId,
          user_id: userId,
          owner_id: userId,
          seller_id: userId,
          price: data.price,
          description: data.description,
          event_date: data.event_date,
          venue: data.venue,
          file_path: data.file_path,
          status: 'available',
          event_id: data.event_id || null
        })
        .select('*')
        .single();
        
      if (error) {
        throw error;
      }
      
      // Type check and fallback to default values if needed
      if (!responseData) {
        throw new Error('No data returned after insertion');
      }
      
      // Create the ticket object with fallback values to ensure type safety
      const ticket: UserTicket = {
        id: ticketId, // Use ticketId as it's guaranteed to exist
        title: data.title || data.description || 'Ticket',
        description: data.description || undefined,
        category: data.category_name || 'Other',
        price: data.price,
        event_id: data.event_id || null,
        status: 'available',
        file_path: data.file_path || undefined,
        created_at: new Date().toISOString(),
        seller_id: userId,
        buyer_id: undefined,
        owner_id: userId,
        event_date: data.event_date || undefined,
        venue: data.venue || undefined
      };
      
      return { success: true, ticket };
    } catch (err) {
      console.error('Error adding ticket:', err);
      return { success: false, error: 'Failed to add ticket' };
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a ticket
  const deleteTicket = async (ticketId: string, category: string): Promise<boolean> => {
    if (!userId) {
      return false;
    }
    
    setLoading(true);
    try {
      const tableName = getCategoryTableName(category);
      
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .match({ id: ticketId, owner_id: userId });
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting ticket:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return { addTicket, deleteTicket, loading };
}
