
import { supabase } from "@/integrations/supabase/client";

/**
 * Simple version of ticket deletion that works as a fallback
 * when other deletion methods fail
 */
export async function deleteTicketSimple(ticketId: string): Promise<boolean> {
  if (!ticketId) {
    console.error('Missing required parameter: ticketId');
    return false;
  }

  try {
    // First, check if the ticket exists and get its data
    const { data: ticketData, error: getError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .maybeSingle();
      
    if (getError) {
      console.error("Error getting ticket data:", getError);
      return false;
    }
    
    if (!ticketData) {
      console.error("Ticket not found with ID:", ticketId);
      return false;
    }
    
    // Check if the user has permission to delete this ticket
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || (ticketData.seller_id !== user.id && ticketData.owner_id !== user.id)) {
      console.error("User doesn't have permission to delete this ticket");
      return false;
    }
    
    // Copy to deleted_tickets table
    const { error: insertError } = await supabase
      .from('deleted_tickets')
      .insert({
        original_id: ticketData.id,
        title: ticketData.title,
        description: ticketData.description,
        price: ticketData.price,
        user_id: ticketData.user_id,
        seller_id: ticketData.seller_id,
        buyer_id: ticketData.buyer_id,
        owner_id: ticketData.owner_id,
        status: ticketData.status,
        file_path: ticketData.file_path,
        category_id: ticketData.category_id,
        category_name: ticketData.category_name,
        venue: ticketData.venue,
        event_id: ticketData.event_id,
        event_date: ticketData.event_date,
        event_time: ticketData.event_time,
        price_per_unit: ticketData.price_per_unit,
        quantity: ticketData.quantity,
        created_at: ticketData.created_at,
        updated_at: ticketData.updated_at,
        seat_info: ticketData.seat_info
      });
      
    if (insertError) {
      console.error("Error copying ticket to deleted_tickets:", insertError);
      return false;
    }
    
    // Delete the original ticket
    const { error: deleteError } = await supabase
      .from('tickets')
      .delete()
      .eq('id', ticketId);
      
    if (deleteError) {
      console.error("Error deleting original ticket:", deleteError);
      return false;
    }
    
    console.log(`Successfully deleted ticket with ID: ${ticketId}`);
    return true;
  } catch (err) {
    console.error("Error in deleteTicketSimple:", err);
    return false;
  }
}
