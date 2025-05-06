
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
      console.error('Ticket not found');
      return false;
    }
    
    // Extra check to ensure ticket belongs to user and hasn't been sold
    if (ticketData.seller_id !== userId || ticketData.owner_id !== userId || ticketData.buyer_id !== null) {
      console.error('Cannot delete: Ticket does not belong to the current user or has already been sold');
      return false;
    }
    
    // Start a transaction using the edge function that will handle:
    // 1. Copy the ticket to deleted_tickets table
    // 2. Delete the original ticket
    // 3. Handle file deletion if necessary
    const { error: deleteError } = await supabase.functions.invoke('tickets-management', {
      body: {
        action: 'soft-delete-ticket',
        ticketId: ticketId,
        userId: userId
      }
    });
    
    if (deleteError) {
      console.error(`Error soft deleting ticket:`, deleteError);
      return false;
    }
    
    console.log(`Successfully soft deleted ticket with ID: ${ticketId}`);
    return true;
  } catch (err) {
    console.error('Error in deleteTicketMutation:', err);
    return false;
  }
}
