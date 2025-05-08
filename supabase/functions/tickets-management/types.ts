
// Define types for request payloads and responses
export interface TicketData {
  title: string;
  price: number;
  categoryName: string;
  description?: string;
  filePath?: string;
  eventDate?: string;
  venue?: string;
  categoryId?: string;
  [key: string]: any; // For any additional properties
}

export interface UpdateTicketData {
  title?: string;
  price?: number;
  description?: string;
  categoryName?: string;
  venue?: string;
  categoryId?: string;
  eventDate?: string;
  user_id?: string; // Will be removed in the handler
  [key: string]: any; // For any additional properties
}

export interface RequestPayload {
  action?: string;
  ticketId?: string;
  userId?: string;
  [key: string]: any; // For any additional properties
}
