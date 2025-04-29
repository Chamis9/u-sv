
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AddTicketData, UserTicket } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { getCategoryTableName } from "@/utils/categoryMapping";

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
      // Use the provided table_name or determine it from the category
      const tableName = data.table_name || getCategoryTableName(data.category_name || 'Other');
      
      console.log(`Adding ticket to table: ${tableName}`);
      console.log(`Full ticket data:`, JSON.stringify(data, null, 2));
      console.log(`Current user ID: ${userId}`);
      
      // Create the base insert object with properties common to all ticket tables
      const insertData = {
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
        event_id: data.event_id || null,
        category_id: data.category_id
      };
      
      // For some tables, we need to handle the title field differently
      // Instead of trying to insert a title field which may not exist,
      // we'll only use the title for the description if needed
      console.log(`Inserting ticket into ${tableName} with ID: ${ticketId}`);
      
      const { data: responseData, error } = await supabase
        .from(tableName as any)
        .insert(insertData)
        .select('*')
        .single();
        
      if (error) {
        console.error(`Error inserting into table ${tableName}:`, error);
        let errorMessage = `Failed to add ticket: ${error.message}`;
        
        if (error.code === '42501') {
          errorMessage = `Row Level Security prevented adding ticket to ${tableName}. User ID: ${userId}`;
          console.error('RLS error details:', { 
            userId, 
            tableName, 
            errorCode: error.code,
            errorMessage: error.message
          });
        } else if (error.message.includes('schema cache')) {
          // This typically happens when trying to insert a column that doesn't exist
          errorMessage = `Failed to add ticket: Could not find the 'title' column of '${tableName}' in the schema cache`;
          console.error('Schema error details:', {
            tableName,
            data: insertData
          });
        }
        
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
      
      console.log(`Successfully added ticket to ${tableName}:`, responseData);
      
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
        venue: data.venue || undefined,
        table_name: tableName
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
  
  // Delete a ticket
  const deleteTicket = async (ticketId: string, category: string): Promise<boolean> => {
    if (!userId) {
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const tableName = getCategoryTableName(category);
      
      console.log(`Deleting ticket from table: ${tableName}`);
      console.log(`Ticket ID: ${ticketId}, Category: ${category}, User ID: ${userId}`);
      
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .match({ id: ticketId, owner_id: userId });
        
      if (error) {
        console.error(`Error deleting ticket from ${tableName}:`, error);
        setError(`Failed to delete ticket: ${error.message}`);
        throw error;
      }
      
      console.log(`Successfully deleted ticket from ${tableName}`);
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
  
  return { addTicket, deleteTicket, loading, error };
}
