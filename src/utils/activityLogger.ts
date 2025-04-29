
import { supabase } from "@/integrations/supabase/client";

export type ActivityType = 'subscriber' | 'user' | 'ticket' | 'system' | 'login' | 'logout' | 'settings';

export interface LogActivityParams {
  activityType: ActivityType;
  description: string;
  userId?: string;
  email?: string;
  metadata?: Record<string, any> | null;
}

/**
 * Logs an activity using an RPC function
 */
export async function logActivity({
  activityType,
  description,
  userId,
  email,
  metadata
}: LogActivityParams) {
  try {
    // Use RPC function to insert activity log
    const { error } = await supabase.rpc('log_activity', {
      p_activity_type: activityType,
      p_description: description,
      p_user_id: userId || null,
      p_email: email || null,
      p_metadata: metadata || null
    });
    
    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Error in logActivity:', error);
  }
}
