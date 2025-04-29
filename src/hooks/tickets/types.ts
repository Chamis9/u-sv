
export interface AddTicketData {
  title: string;
  description?: string;
  price: number;
  user_id: string;
  file_path?: string;
  category_name?: string;
  category_id?: string;
  event_id?: string | null;
  event_date?: string | null;
  venue?: string | null;
}

export interface UserTicket {
  id: string;
  title: string;
  description?: string;
  category: string;
  category_name?: string;
  price: number;
  event_id: string | null;
  status: 'available' | 'sold' | 'expired';
  file_path?: string;
  created_at: string;
  seller_id?: string;
  buyer_id?: string;
  owner_id: string;
  event_date?: string | null;
  venue?: string | null;
}
