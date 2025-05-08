
import { supabase } from "@/integrations/supabase/client";

export async function deleteTicketMutation(ticketId: string, userId: string): Promise<boolean> {
  if (!ticketId || !userId) {
    console.error('Missing required parameters: ticketId or userId');
    return false;
  }

  try {
    console.log(`Deleting ticket with ID: ${ticketId}, Auth User ID: ${userId}`);
    
    // Always verify we have an active session before proceeding
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error("No valid auth session:", sessionError);
      return false;
    }
    
    // Critical: Use the authenticated user ID from the session
    const authUserId = sessionData.session.user.id;
    
    if (authUserId !== userId) {
      console.warn("Warning: Auth user ID doesn't match provided user ID. Using auth user ID.");
    }
    
    // First verify the ticket exists and belongs to the user before deletion
    const { data: ticketData, error: checkError } = await supabase
      .from('tickets')
      .select('*')  // Select all columns to copy to deleted_tickets table
      .eq('id', ticketId)
      .eq('seller_id', authUserId) // Only get tickets owned by this user
      .maybeSingle();
      
    if (checkError) {
      console.error(`Error verifying ticket ownership:`, checkError);
      return false;
    }
    
    if (!ticketData) {
      console.error('Ticket not found or already deleted or not owned by current user');
      return false;
    }
    
    // Extra check to ensure ticket belongs to user and hasn't been sold
    if (ticketData.seller_id !== authUserId || ticketData.owner_id !== authUserId || ticketData.buyer_id !== null) {
      console.error('Cannot delete: Ticket does not belong to the current user or has already been sold');
      return false;
    }
    
    // Copy ticket to deleted_tickets table with all fields
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
        price_per_unit: ticketData.price_per_unit || ticketData.price,
        quantity: ticketData.quantity || 1,
        user_id: ticketData.user_id,
        seller_id: ticketData.seller_id,
        buyer_id: ticketData.buyer_id,
        owner_id: ticketData.owner_id,
        created_at: ticketData.created_at,
        updated_at: ticketData.updated_at
      });
      
    if (insertError) {
      console.error('Error copying ticket to deleted_tickets table:', insertError);
      // Continue with deletion even if copying to deleted_tickets fails
      // This ensures the user can still delete their ticket
    } else {
      console.log('Successfully copied ticket to deleted_tickets table');
    }
    
    // Now delete the original ticket - CRITICAL PART
    console.log(`Executing DELETE from tickets where id=${ticketId} AND seller_id=${authUserId}`);
    const { error: deleteError } = await supabase
      .from('tickets')
      .delete()
      .eq('id', ticketId)
      .eq('seller_id', authUserId); // Critical: use the auth user ID
      
    if (deleteError) {
      console.error('Error deleting original ticket:', deleteError);
      return false;
    }
    
    console.log(`Successfully deleted ticket with ID: ${ticketId}`);
    return true;
  } catch (err) {
    console.error('Error in deleteTicketMutation:', err);
    return false;
  }
}
