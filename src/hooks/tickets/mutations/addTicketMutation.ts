
import { supabase } from "@/integrations/supabase/client";
import { AddTicketData, UserTicket } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { createTicketObject } from "./helpers";

export async function addTicketMutation(
  data: AddTicketData, 
  userId: string
): Promise<{ success: boolean; ticket?: UserTicket; error?: string }> {
  try {
    const ticketId = uuidv4();
    
    console.log(`Adding ticket to consolidated tickets table`);
    console.log(`Full ticket data:`, JSON.stringify(data, null, 2));
    console.log(`Current user ID: ${userId}`);
    
    // Create the insert object with all necessary fields
    const insertData = {
      id: ticketId,
      user_id: userId,
      owner_id: userId,
      seller_id: userId,
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
    
    console.log(`Inserting ticket with ID: ${ticketId}`);
    
    const { data: responseData, error } = await supabase
      .from('tickets')
      .insert(insertData)
      .select('*')
      .single();
      
    if (error) {
      console.error(`Error inserting ticket:`, error);
      let errorMessage = `Failed to add ticket: ${error.message}`;
      
      if (error.code === '42501') {
        errorMessage = `Row Level Security prevented adding ticket. User ID: ${userId}`;
        console.error('RLS error details:', { 
          userId, 
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
    const ticket = createTicketObject(responseData, ticketId, userId);
    
    return { success: true, ticket };
  } catch (err: any) {
    console.error('Error in addTicketMutation:', err);
    return { success: false, error: err.message || 'Failed to add ticket' };
  }
}
