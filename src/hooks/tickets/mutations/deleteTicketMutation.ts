
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
    
    // Start a transaction using direct database operations instead of the edge function
    // 1. Copy the ticket to deleted_tickets table
    const { error: insertError } = await supabase
      .from('deleted_tickets')
      .insert({
        original_id: ticketData.id,
        title: ticketData.title,
        description: ticketData.description,
        price: ticketData.price,
        category_name: ticketData.category_name,
        venue: ticketData.venue,
        seat_info: ticketData.seat_info,
        file_path: ticketData.file_path,
        category_id: ticketData.category_id,
        event_date: ticketData.event_date,
        event_time: ticketData.event_time,
        event_id: ticketData.event_id,
        price_per_unit: ticketData.price_per_unit,
        quantity: ticketData.quantity,
        user_id: ticketData.user_id,
        seller_id: ticketData.seller_id,
        buyer_id: ticketData.buyer_id,
        owner_id: ticketData.owner_id,
        created_at: ticketData.created_at
      });
      
    if (insertError) {
      console.error('Error copying ticket to deleted_tickets table:', insertError);
      return false;
    }
    
    // 2. Delete the original ticket
    const { error: deleteError } = await supabase
      .from('tickets')
      .delete()
      .eq('id', ticketId)
      .eq('seller_id', userId)
      .eq('owner_id', userId)
      .is('buyer_id', null);
      
    if (deleteError) {
      console.error('Error deleting original ticket:', deleteError);
      return false;
    }
    
    console.log(`Successfully soft deleted ticket with ID: ${ticketId}`);
    return true;
  } catch (err) {
    console.error('Error in deleteTicketMutation:', err);
    return false;
  }
}
