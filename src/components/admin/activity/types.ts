
import { Json } from "@/integrations/supabase/types";

export interface ActivityLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface Activity {
  id: string;
  activity_type: string;
  description: string;
  email?: string;
  user_id?: string;
  metadata?: Record<string, any> | null;
  created_at: string;
}

// Helper type to parse JSON returned from RPC functions
export interface JsonActivity {
  id: string;
  activity_type: string;
  description: string;
  email?: string;
  user_id?: string;
  metadata?: Json | null;
  created_at: string;
}

// Function to convert JsonActivity to Activity
export function convertJsonToActivity(json: JsonActivity): Activity {
  return {
    ...json,
    metadata: json.metadata as Record<string, any> | null
  };
}
