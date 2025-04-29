
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
  seller_id?: string;
  buyer_id?: string;
  owner_id: string;
  event_date?: string | null;
  venue?: string | null;
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
  event_date?: string | null;
  venue?: string | null;
}

export interface TicketMutationResult {
  isLoading: boolean;
  error: Error | null;
}

// Using more generic typing instead of specific table reference
export type TicketData = {
  id: string;
  description?: string;
  price: number;
  user_id: string;
  status: string;
  file_path?: string | null;
  created_at: string;
  // Add other common fields used across ticket tables
  seller_id?: string;
  buyer_id?: string;
  owner_id: string;
  event_id?: string | null;
  category_id?: string | null;
  event_date?: string | null;
  venue?: string | null;
};
