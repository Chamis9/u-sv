
import { Database } from "@/integrations/supabase/types";

export interface UserTicket {
  id: string;
  title: string;
  description?: string;
  category: string;
  price: number;
  event_id: string | null;
  status: 'available' | 'sold' | 'expired' | 'purchased';
  file_path?: string;
  created_at: string;
}

export interface AddTicketData {
  title: string;
  description?: string | null;
  event_id: string | null;
  price: number;
  user_id: string;
  file_path?: string | null;
  seat_info?: string | null;
  category_name?: string;
  category_id?: string;
  quantity?: number;
}

export interface TicketMutationResult {
  isLoading: boolean;
  error: Error | null;
}

export type TicketData = Database['public']['Tables']['tickets']['Row'];
