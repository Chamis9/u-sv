
import { useState } from 'react';
import { AddTicketData, UserTicket } from "./types";
import { addTicketMutation } from './mutations/addTicketMutation';
import { updateTicketMutation } from './mutations/updateTicketMutation';
import { deleteTicketMutation } from './mutations/deleteTicketMutation';
import { deleteTicketSimple } from './mutations/deleteTicketSimple';
import { supabase } from "@/integrations/supabase/client";

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
      console.log(`Preparing to add ticket for user: ${userId}`);
      
      // Get the current authenticated user from Supabase
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        const errorMsg = 'Authentication error: User not logged in';
        console.error(errorMsg, authError);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
      
      console.log(`Current authenticated user: ${user.id}`);
      const result = await addTicketMutation(data, user.id);
      
      if (!result.success) {
        console.error('Failed to add ticket:', result.error);
        setError(result.error || 'Failed to add ticket');
      }
      
      return result;
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
      // Get the current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Authentication required' };
      }
      
      const result = await updateTicketMutation(ticketId, data, user.id);
      
      if (!result.success) {
        setError(result.error || 'Failed to update ticket');
      }
      
      return result;
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
      // Get the current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Authentication required');
        return false;
      }
      
      // First try the normal deletion function
      let success = await deleteTicketMutation(ticketId, user.id);
      
      // If that fails, try the simple deletion function as a fallback
      if (!success) {
        console.log("Regular delete failed, trying simple delete as fallback");
        success = await deleteTicketSimple(ticketId);
      }
      
      if (!success) {
        setError('Failed to delete ticket');
      }
      
      return success;
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
