
import { UserTicket } from "../types";

// Helper function to create a UserTicket object from response data
export function createTicketObject(responseData: any, ticketId: string, userId: string): UserTicket {
  console.log("Creating ticket object from response data:", responseData);
  
  // Create a more reliable ticket object by checking existence of each field
  const ticket: UserTicket = {
    id: ticketId || responseData.id,
    title: responseData.title || 'Untitled Ticket',
    description: responseData.description || '',
    category: responseData.category_name || 'Other',
    price: typeof responseData.price === 'number' ? responseData.price : parseFloat(responseData.price) || 0,
    status: responseData.status || 'available',
    file_path: responseData.file_path,
    created_at: responseData.created_at || new Date().toISOString(),
    owner_id: responseData.owner_id || userId,
    seller_id: responseData.seller_id,
    buyer_id: responseData.buyer_id,
    event_id: responseData.event_id || null,
    event_date: responseData.event_date || null,
    venue: responseData.venue || null,
    quantity: responseData.quantity || 1,
    price_per_unit: typeof responseData.price_per_unit === 'number' ? responseData.price_per_unit : parseFloat(responseData.price_per_unit) || 0,
    event_time: responseData.event_time || null,
  };
  
  console.log("Created ticket object:", ticket);
  return ticket;
}

// Helper function to prepare supabase fetch headers
export function prepareSupabaseHeaders(apiKey: string) {
  return {
    'apikey': apiKey,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Prefer': 'return=representation'
  };
}
