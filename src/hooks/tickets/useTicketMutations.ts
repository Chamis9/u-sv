import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AddTicketData, UserTicket } from "./types";
import { v4 as uuidv4 } from 'uuid';

export function useTicketMutations(userId?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add a new ticket
  const addTicket = async (data: AddTicketData): Promise<{ success: boolean; ticket?: UserTicket; error?: string }> => {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);
    
    try {
      const ticketId = uuidv4();
      
      console.log(`Adding ticket to consolidated tickets table`);
      console.log(`Full ticket data:`, JSON.stringify(data, null, 2));
      console.log(`Current user ID: ${userId}`);
      
      // Create the insert object with all necessary fields
      const insertData = {
        id: ticketId,
        user_id: userId,
        owner_id: userId,
        seller_id: userId,
        price: data.price,
        title: data.title || data.description,
        description: data.description,
        event_date: data.event_date,
        venue: data.venue,
        file_path: data.file_path,
        status: 'available' as 'available' | 'sold' | 'expired',
        event_id: data.event_id || null,
        category_id: data.category_id,
        category_name: data.category_name,
        quantity: data.quantity || 1,
        price_per_unit: data.price_per_unit || data.price || 0,
        event_time: data.event_time || null
      };
      
      console.log(`Inserting ticket with ID: ${ticketId}`);
      
      const { data: responseData, error } = await supabase
        .from('tickets')
        .insert(insertData)
        .select('*')
        .single();
        
      if (error) {
        console.error(`Error inserting ticket:`, error);
        let errorMessage = `Failed to add ticket: ${error.message}`;
        
        if (error.code === '42501') {
          errorMessage = `Row Level Security prevented adding ticket. User ID: ${userId}`;
          console.error('RLS error details:', { 
            userId, 
            errorCode: error.code,
            errorMessage: error.message
          });
        }
        
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
      
      console.log(`Successfully added ticket:`, responseData);
      
      // Type check and fallback to default values if needed
      if (!responseData) {
        throw new Error('No data returned after insertion');
      }
      
      // Create the ticket object with fallback values to ensure type safety
      const ticket: UserTicket = {
        id: ticketId, // Use ticketId as it's guaranteed to exist
        title: responseData.title || responseData.description || 'Ticket',
        description: responseData.description || undefined,
        category: responseData.category_name || 'Other',
        price: responseData.price,
        event_id: responseData.event_id || null,
        status: 'available',
        file_path: responseData.file_path || undefined,
        created_at: responseData.created_at || new Date().toISOString(),
        seller_id: responseData.seller_id || undefined,
        buyer_id: responseData.buyer_id || undefined,
        owner_id: responseData.owner_id || userId,
        event_date: responseData.event_date || undefined,
        venue: responseData.venue || undefined,
        category_name: responseData.category_name,
        quantity: responseData.quantity || 1,
        price_per_unit: responseData.price_per_unit || responseData.price || 0,
        event_time: responseData.event_time || null
      };
      
      return { success: true, ticket };
    } catch (err: any) {
      console.error('Error adding ticket:', err);
      const errorMessage = err.message || 'Failed to add ticket';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  // Update existing ticket
  const updateTicket = async (ticketId: string, data: Partial<AddTicketData>): Promise<{ success: boolean; ticket?: UserTicket; error?: string }> => {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log(`Updating ticket with ID: ${ticketId}`);
      console.log(`Update data:`, JSON.stringify(data, null, 2));
      
      // Create the update object with provided fields
      const updateData: Record<string, any> = {};
      
      if (data.title) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.event_date !== undefined) updateData.event_date = data.event_date;
      if (data.venue !== undefined) updateData.venue = data.venue;
      if (data.file_path) updateData.file_path = data.file_path;
      if (data.category_id) updateData.category_id = data.category_id;
      if (data.category_name) updateData.category_name = data.category_name;
      if (data.quantity) updateData.quantity = data.quantity;
      if (data.price_per_unit) updateData.price_per_unit = data.price_per_unit;
      if (data.event_time) updateData.event_time = data.event_time;
      
      // Update timestamp
      updateData.updated_at = new Date().toISOString();
      
      console.log(`Final update data:`, updateData);
      
      const { data: responseData, error } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', ticketId)
        .eq('owner_id', userId)  // Security check: ensure user owns the ticket
        .select('*')
        .single();
        
      if (error) {
        console.error(`Error updating ticket:`, error);
        setError(`Failed to update ticket: ${error.message}`);
        return { success: false, error: error.message };
      }
      
      console.log(`Successfully updated ticket:`, responseData);
      
      // Type check and create the ticket object with fallback values
      if (!responseData) {
        throw new Error('No data returned after update');
      }
      
      // Create the ticket object with fallback values to ensure type safety
      const ticket: UserTicket = {
        id: ticketId,
        title: responseData.title || responseData.description || 'Ticket',
        description: responseData.description || undefined,
        category: responseData.category_name || 'Other',
        price: responseData.price,
        event_id: responseData.event_id || null,
        status: responseData.status || 'available',
        file_path: responseData.file_path || undefined,
        created_at: responseData.created_at || new Date().toISOString(),
        seller_id: responseData.seller_id || undefined,
        buyer_id: responseData.buyer_id || undefined,
        owner_id: responseData.owner_id || userId,
        event_date: responseData.event_date || undefined,
        venue: responseData.venue || undefined,
        category_name: responseData.category_name,
        quantity: responseData.quantity || 1,
        price_per_unit: responseData.price_per_unit || responseData.price || 0,
        event_time: responseData.event_time || null
      };
      
      return { success: true, ticket };
    } catch (err: any) {
      console.error('Error updating ticket:', err);
      const errorMessage = err.message || 'Failed to update ticket';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a ticket
  const deleteTicket = async (ticketId: string): Promise<boolean> => {
    if (!userId) {
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Deleting ticket with ID: ${ticketId}, User ID: ${userId}`);
      
      const { error } = await supabase
        .from('tickets')
        .delete()
        .match({ id: ticketId, owner_id: userId });
        
      if (error) {
        console.error(`Error deleting ticket:`, error);
        setError(`Failed to delete ticket: ${error.message}`);
        throw error;
      }
      
      console.log(`Successfully deleted ticket`);
      return true;
    } catch (err: any) {
      console.error('Error deleting ticket:', err);
      const errorMessage = err.message || 'Failed to delete ticket';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return { addTicket, updateTicket, deleteTicket, loading, error };
}
