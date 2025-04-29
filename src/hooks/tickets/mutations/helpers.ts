
import { UserTicket } from "../types";

/**
 * Creates a standardized UserTicket object from database response data
 * with appropriate fallback values for type safety
 */
export function createTicketObject(
  responseData: any, 
  ticketId: string, 
  userId: string
): UserTicket {
  return {
    id: ticketId,
    title: responseData.title || responseData.description || 'Ticket',
    description: responseData.description || undefined,
    category: responseData.category_name || 'Other',
    price: responseData.price,
    event_id: responseData.event_id || null,
    status: responseData.status as 'available' | 'sold' | 'expired',
    file_path: responseData.file_path || undefined,
    created_at: responseData.created_at || new Date().toISOString(),
    seller_id: responseData.seller_id || undefined,
    buyer_id: responseData.buyer_id || undefined,
    owner_id: responseData.owner_id || userId,
    event_date: responseData.event_date || undefined,
    venue: responseData.venue || undefined,
    category_name: responseData.category_name,
    quantity: responseData.quantity || 1,
    price_per_unit: responseData.price_per_unit || responseData.price || 0,
    event_time: responseData.event_time || null
  };
}
