
import { UserTicket } from "../types";

// Helper function to create a UserTicket object from response data
export function createTicketObject(responseData: any, ticketId: string, userId: string): UserTicket {
  return {
    id: ticketId,
    title: responseData.title || 'Untitled Ticket',
    description: responseData.description || '',
    category: responseData.category_name || 'Other',
    price: parseFloat(responseData.price) || 0,
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
    price_per_unit: parseFloat(responseData.price_per_unit) || 0,
    event_time: responseData.event_time || null,
  };
}
