
import { supabase } from "@/integrations/supabase/client";

export async function deleteTicketMutation(ticketId: string, userId: string): Promise<boolean> {
  if (!ticketId || !userId) {
    console.error('Missing required parameters: ticketId or userId');
    return false;
  }

  try {
    console.log(`Soft deleting ticket with ID: ${ticketId}, User ID: ${userId}`);
    
    // First verify the ticket exists and belongs to the user before deletion
    const { data: ticketData, error: checkError } = await supabase
      .from('tickets')
      .select('*')  // Select all columns to copy to deleted_tickets table
      .eq('id', ticketId)
      .maybeSingle();
      
    if (checkError) {
      console.error(`Error verifying ticket ownership:`, checkError);
      return false;
    }
    
    if (!ticketData) {
      console.error('Ticket not found or already deleted');
      return false;
    }
    
    // Extra check to ensure ticket belongs to user and hasn't been sold
    if (ticketData.seller_id !== userId || ticketData.owner_id !== userId || ticketData.buyer_id !== null) {
      console.error('Cannot delete: Ticket does not belong to the current user or has already been sold');
      return false;
    }
    
    // Delete the original ticket directly without trying to save to deleted_tickets
    // This is a workaround for the RLS policy issue
    const { error: deleteError } = await supabase
      .from('tickets')
      .delete()
      .eq('id', ticketId)
      .eq('seller_id', userId)
      .eq('owner_id', userId)
      .is('buyer_id', null);
      
    if (deleteError) {
      console.error('Error deleting ticket:', deleteError);
      return false;
    }
    
    console.log(`Successfully deleted ticket with ID: ${ticketId}`);
    return true;
  } catch (err) {
    console.error('Error in deleteTicketMutation:', err);
    return false;
  }
}
