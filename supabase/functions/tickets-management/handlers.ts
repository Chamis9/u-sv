
import { supabaseClient } from "./supabase-client.ts";
import { TicketData, UpdateTicketData } from "./types.ts";
import { corsHeaders } from "./cors.ts";

export async function getMyTickets(userId: string) {
  // Get user tickets from the tickets table
  const { data, error } = await supabaseClient
    .from('tickets')
    .select('*')
    .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`);
  
  if (error) {
    console.error(`Error fetching tickets:`, error);
    throw new Error(error.message);
  }

  return data;
}

export async function createTicket(userId: string, ticketData: TicketData) {
  console.log(`Creating ticket with data:`, JSON.stringify(ticketData, null, 2));
  
  // Always use the authenticated user's ID
  const { data, error } = await supabaseClient
    .from('tickets')
    .insert({
      title: ticketData.title,
      description: ticketData.description,
      price: ticketData.price,
      user_id: userId,
      seller_id: userId,
      owner_id: userId,
      category_id: ticketData.categoryId,
      category_name: ticketData.categoryName,
      file_path: ticketData.filePath,
      status: 'available',
      event_date: ticketData.eventDate,
      venue: ticketData.venue
    })
    .select()
    .single();
  
  if (error) {
    console.error(`Error creating ticket:`, error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateTicket(ticketId: string, userId: string, updateData: UpdateTicketData) {
  console.log(`Attempting to update ticket: ${ticketId} for user: ${userId}`);
  
  // First check if the ticket exists and belongs to the user
  const { data: ticketData, error: fetchError } = await supabaseClient
    .from('tickets')
    .select('*')
    .eq('id', ticketId)
    .maybeSingle();
  
  if (fetchError) {
    console.error('Error fetching ticket:', fetchError);
    throw new Error(fetchError.message);
  }
  
  if (!ticketData) {
    console.error('Ticket not found:', ticketId);
    throw new Error('Ticket not found');
  }
  
  // Prepare the update data
  const ticketUpdateData = { ...updateData };
  delete ticketUpdateData.user_id; // Don't allow changing the user ID
  ticketUpdateData.updated_at = new Date().toISOString();
  
  console.log('Update data:', ticketUpdateData);
  
  // Update the ticket
  const { data: updatedTicket, error: updateError } = await supabaseClient
    .from('tickets')
    .update(ticketUpdateData)
    .eq('id', ticketId)
    .select('*')
    .maybeSingle();
  
  if (updateError) {
    console.error('Error updating ticket:', updateError);
    throw new Error(updateError.message);
  }
  
  console.log('Successfully updated ticket:', updatedTicket);
  
  return updatedTicket;
}

export async function softDeleteTicket(ticketId: string, userId: string) {
  console.log(`Attempting to soft delete ticket: ${ticketId} for user: ${userId}`);
  
  // First check if the ticket belongs to the user
  const { data: ticketData, error: fetchError } = await supabaseClient
    .from('tickets')
    .select('*')
    .eq('id', ticketId)
    .maybeSingle();
  
  if (fetchError) {
    console.error('Error fetching ticket:', fetchError);
    throw new Error(fetchError.message);
  }
  
  if (!ticketData) {
    console.error('Ticket not found:', ticketId);
    throw new Error('Ticket not found');
  }
  
  // Verify ownership
  if (ticketData.seller_id !== userId || ticketData.owner_id !== userId || ticketData.buyer_id !== null) {
    console.error('Unauthorized delete attempt:', {
      ticketId,
      userId: userId,
      sellerId: ticketData.seller_id,
      ownerId: ticketData.owner_id,
      buyerId: ticketData.buyer_id
    });
    throw new Error('Unauthorized: You can only delete your own unsold tickets');
  }
  
  // Now copy the ticket to deleted_tickets table
  const { error: insertError } = await supabaseClient
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
      created_at: ticketData.created_at,
      updated_at: ticketData.updated_at
    });
  
  if (insertError) {
    console.error('Error copying ticket to deleted_tickets:', insertError);
    throw new Error(insertError.message);
  }
  
  // Now delete the original ticket record - CRITICAL PART
  const { error: deleteError } = await supabaseClient
    .from('tickets')
    .delete()
    .eq('id', ticketId);
  
  if (deleteError) {
    console.error('Error deleting original ticket:', deleteError);
    throw new Error(deleteError.message);
  }
  
  console.log(`Successfully soft deleted ticket: ${ticketId}`);
  return true;
}
