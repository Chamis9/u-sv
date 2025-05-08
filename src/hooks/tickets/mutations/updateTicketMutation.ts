
import { supabase } from "@/integrations/supabase/client";
import { AddTicketData, UserTicket } from "../types";
import { createTicketObject } from "./helpers";

export async function updateTicketMutation(
  ticketId: string, 
  data: Partial<AddTicketData>,
  userId: string
): Promise<{ success: boolean; ticket?: UserTicket; error?: string }> {
  try {
    console.log(`Updating ticket with ID: ${ticketId} using auth user ID: ${userId}`);
    console.log(`Update data:`, JSON.stringify(data, null, 2));
    
    // Always verify we have an active session before proceeding
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error("No valid auth session:", sessionError);
      return { success: false, error: "Authentication session is invalid or expired" };
    }
    
    // Critical: Use the authenticated user ID from the session
    const authUserId = sessionData.session.user.id;
    
    if (authUserId !== userId) {
      console.warn("Warning: Auth user ID doesn't match provided user ID. Using auth user ID.");
    }
    
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
    
    // Use the Supabase RLS policies we just created to handle authorization
    const { data: responseData, error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', ticketId)
      .eq('seller_id', authUserId) // Ensure we're only updating the current user's tickets
      .select('*')
      .maybeSingle();
      
    if (error) {
      console.error(`Error updating ticket:`, error);
      return { success: false, error: `Error: ${error.message}` };
    }
    
    console.log(`Successfully updated ticket:`, responseData);
    
    // Type check and create the ticket object with fallback values
    if (!responseData) {
      return { 
        success: false, 
        error: 'No data returned after update. Ticket might not exist or you may not have permission to update it.' 
      };
    }
    
    // Create the ticket object with the response data
    const ticket = createTicketObject(responseData, ticketId, authUserId);
    
    return { success: true, ticket };
  } catch (err: any) {
    console.error('Error in updateTicketMutation:', err);
    return { success: false, error: err.message || 'Failed to update ticket' };
  }
}
