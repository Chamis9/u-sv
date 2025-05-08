
import { supabase } from "@/integrations/supabase/client";
import { AddTicketData, UserTicket } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { createTicketObject } from "./helpers";

export async function addTicketMutation(
  data: AddTicketData, 
  userId: string
): Promise<{ success: boolean; ticket?: UserTicket; error?: string }> {
  try {
    // First, get the current auth session to verify authentication
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error("No valid auth session:", sessionError);
      return { success: false, error: "Authentication session is invalid or expired" };
    }
    
    // Important: Use the authenticated user ID from the session instead of the passed userId
    const authUserId = sessionData.session.user.id;
    
    console.log("Current auth session user ID:", authUserId);
    console.log("Using passed user ID for reference:", userId);
    
    // Next, refresh the auth session to ensure token is valid
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      console.error("Error refreshing session before adding ticket:", refreshError);
      return { success: false, error: `Auth refresh failed: ${refreshError.message}` };
    }
    
    const ticketId = uuidv4();
    
    console.log(`Adding ticket to consolidated tickets table`);
    console.log(`Full ticket data:`, JSON.stringify(data, null, 2));
    console.log(`Auth user ID: ${authUserId}`);
    
    // Create the insert object with all necessary fields
    const insertData = {
      id: ticketId,
      user_id: authUserId, // Use the auth user ID, not the passed userId
      seller_id: authUserId, // Use the auth user ID, not the passed userId
      owner_id: authUserId, // Use the auth user ID, not the passed userId
      price: data.price,
      title: data.title || data.description,
      description: data.description,
      event_date: data.event_date,
      venue: data.venue,
      file_path: data.file_path,
      status: 'available' as const,
      event_id: data.event_id || null,
      category_id: data.category_id,
      category_name: data.category_name,
      quantity: data.quantity || 1,
      price_per_unit: data.price_per_unit || data.price || 0,
      event_time: data.event_time || null
    };
    
    console.log(`Inserting ticket with ID: ${ticketId} using auth user ID: ${authUserId}`);
    
    // Get the current auth user to double-check authentication state
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("Error retrieving authenticated user:", userError);
      return { success: false, error: "Authentication session is invalid or expired" };
    }
    
    console.log(`Authenticated user from getUser:`, userData.user.id);
    
    // Proceed with the insert using the authenticated user's ID
    const { data: responseData, error } = await supabase
      .from('tickets')
      .insert(insertData)
      .select('*')
      .single();
      
    if (error) {
      console.error(`Error inserting ticket:`, error);
      let errorMessage = `Failed to add ticket: ${error.message}`;
      
      if (error.code === '42501') {
        errorMessage = `Row Level Security prevented adding ticket. Auth User ID: ${authUserId}, Provided User ID: ${userId}`;
        console.error('RLS error details:', { 
          userId, 
          authUserId,
          errorCode: error.code,
          errorMessage: error.message
        });
      }
      
      return { success: false, error: errorMessage };
    }
    
    console.log(`Successfully added ticket:`, responseData);
    
    // Type check and fallback to default values if needed
    if (!responseData) {
      throw new Error('No data returned after insertion');
    }
    
    // Create the ticket object with the response data
    const ticket = createTicketObject(responseData, ticketId, authUserId);
    
    return { success: true, ticket };
  } catch (err: any) {
    console.error('Error in addTicketMutation:', err);
    return { success: false, error: err.message || 'Failed to add ticket' };
  }
}
