
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

// Function to safely convert Json to JsonActivity
export function safeConvertJsonArrayToActivities(jsonArray: Json[] | null): Activity[] {
  if (!jsonArray || !Array.isArray(jsonArray)) {
    return [];
  }
  
  try {
    // First cast to unknown, then to JsonActivity[] to satisfy TypeScript
    const jsonActivities = jsonArray as unknown as JsonActivity[];
    return jsonActivities.map(convertJsonToActivity);
  } catch (err) {
    console.error("Error converting JSON to activities:", err);
    return [];
  }
}
