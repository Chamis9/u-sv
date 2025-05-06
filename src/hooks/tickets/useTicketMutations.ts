
import { useState } from 'react';
import { AddTicketData, UserTicket } from "./types";
import { addTicketMutation } from './mutations/addTicketMutation';
import { updateTicketMutation } from './mutations/updateTicketMutation';
import { deleteTicketMutation } from './mutations/deleteTicketMutation';

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
      const result = await addTicketMutation(data, userId);
      
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
      const result = await updateTicketMutation(ticketId, data, userId);
      
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
      // Use the direct deletion function that bypasses the edge function
      const success = await deleteTicketMutation(ticketId, userId);
      
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
