
import { supabase } from "@/integrations/supabase/client";
import { AddTicketData, UserTicket } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { createTicketObject } from "./helpers";

export async function addTicketMutation(
  data: AddTicketData, 
  userId: string
): Promise<{ success: boolean; ticket?: UserTicket; error?: string }> {
  try {
    console.log("Add ticket mutation started with auth user ID:", userId);
    console.log("Ticket data:", JSON.stringify(data, null, 2));
    
    // Always verify we have an active session before proceeding
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error("No valid auth session:", sessionError);
      return { success: false, error: "Authentication session is invalid or expired" };
    }
    
    // Critical: Use the authenticated user ID from the session
    const authUserId = sessionData.session.user.id;
    
    console.log("Auth verification complete:");
    console.log("- Session exists:", !!sessionData.session);
    console.log("- Auth User ID:", authUserId);
    console.log("- Provided User ID:", userId);
    
    if (authUserId !== userId) {
      console.warn("Warning: Auth user ID doesn't match provided user ID. Using auth user ID.");
    }
    
    const ticketId = uuidv4();
    
    // Create the insert object with all necessary fields
    const insertData = {
      id: ticketId,
      user_id: authUserId, // Use the authenticated user ID
      seller_id: authUserId, // Use the authenticated user ID
      owner_id: authUserId, // Use the authenticated user ID
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
    
    console.log("Inserting ticket with data:", JSON.stringify(insertData, null, 2));
    
    // Insert the ticket using the Supabase client
    const { data: responseData, error } = await supabase
      .from('tickets')
      .insert(insertData)
      .select('*')
      .single();
      
    if (error) {
      console.error(`Error inserting ticket:`, error);
      
      // Enhanced error reporting
      let errorMessage = `Failed to add ticket: ${error.message}`;
      
      if (error.code === '42501') {
        errorMessage = `Row Level Security prevented adding ticket. Auth User ID: ${authUserId}, Error: ${error.message}`;
        console.error('RLS error details:', { 
          userId: authUserId,
          errorCode: error.code,
          errorMessage: error.message,
          details: error.details
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
