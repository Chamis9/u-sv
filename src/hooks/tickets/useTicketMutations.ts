
import { useState } from 'react';
import { AddTicketData, UserTicket } from "./types";
import { addTicketMutation } from './mutations/addTicketMutation';
import { updateTicketMutation } from './mutations/updateTicketMutation';
import { deleteTicketMutation } from './mutations/deleteTicketMutation';
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
      // First refresh the auth session to ensure we have valid token
      try {
        // This is critical - must refresh session before any DB operations
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error("Error refreshing session before adding ticket:", refreshError);
        }
      } catch (refreshErr) {
        console.error("Exception during session refresh:", refreshErr);
      }
      
      // Get the current session to use the correct auth user ID
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        return { success: false, error: 'No valid authentication session found' };
      }
      
      const authUserId = sessionData.session?.user.id;
      
      console.log("Session data:", {
        sessionExists: !!sessionData.session,
        authUserId,
        passedUserId: userId
      });
      
      // Make sure to use the auth user ID in the ticket creation
      const result = await addTicketMutation({
        ...data,
        user_id: authUserId // Ensure we use the authenticated user ID
      }, authUserId); // Pass the auth user ID, not the passed userId
      
      if (!result.success) {
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
      // First refresh the auth session to ensure we have valid token
      try {
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error("Error refreshing session before updating ticket:", refreshError);
        }
      } catch (refreshErr) {
        console.error("Exception during session refresh:", refreshErr);
      }
      
      // Get the current session to use the correct auth user ID
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        return { success: false, error: 'No valid authentication session found' };
      }
      
      const authUserId = sessionData.session?.user.id;
      
      // Use the authenticated user ID, not the passed userId
      const result = await updateTicketMutation(ticketId, data, authUserId);
      
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
      // First refresh the auth session to ensure we have valid token
      try {
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error("Error refreshing session before deleting ticket:", refreshError);
        }
      } catch (refreshErr) {
        console.error("Exception during session refresh:", refreshErr);
      }
      
      // Get the current session to use the correct auth user ID
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setError('No valid authentication session found');
        return false;
      }
      
      const authUserId = sessionData.session?.user.id;
      
      // Use the authenticated user ID, not the passed userId
      const success = await deleteTicketMutation(ticketId, authUserId);
      
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
