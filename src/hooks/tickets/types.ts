
export interface Ticket {
  id: string;
  user_id: string;
  event_id: string;
  price: number;
  quantity: number;
  seat_info: string | null;
  description: string | null;
  status: 'available' | 'sold' | 'cancelled';
  created_at: string;
  updated_at: string;
  file_path?: string | null;
  image_path?: string | null;
  events?: {
    title: string;
    start_date: string;
  };
}

export interface AddTicketData {
  event_id: string;
  price: number;
  quantity: number;
  seat_info?: string;
  description?: string;
  file_path?: string;
  image_path?: string;
}
