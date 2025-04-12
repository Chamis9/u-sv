
import { supabase } from '@/integrations/supabase/client';
import type { Subscriber } from '@/types/subscribers';
import { logActivity } from '@/utils/activityLogger';

export const addSubscriber = async (email: string) => {
  try {
    // First check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (checkError) {
      console.log("Error checking existing subscriber:", checkError);
      // If it's a permission error, we ignore it and try to insert anyway
      // This happens for anonymous users who can't SELECT due to RLS
    } else if (existingSubscriber) {
      return { success: false, error: 'Email already subscribed', data: null };
    }
    
    // Attempt to insert the new subscriber
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email })
      .select()
      .single();
    
    if (error) {
      console.error("Error subscribing:", error);
      
      // Check for duplicate email error from Postgres
      if (error.code === '23505') {
        return { success: false, error: 'Email already subscribed', data: null };
      }
      
      return { success: false, error: error.message, data: null };
    }
    
    if (data) {
      // Log the activity
      try {
        await logActivity({
          activityType: 'subscriber',
          description: 'New subscriber added',
          email
        });
      } catch (logError) {
        // If logging fails, we still want to return success for the subscription
        console.error("Error logging subscriber activity:", logError);
      }
    }
    
    return { success: true, error: null, data };
  } catch (error: any) {
    console.error("Unexpected error adding subscriber:", error);
    return { success: false, error: error.message || 'Error adding subscriber', data: null };
  }
};

export const filterSubscribers = (subscribers: Subscriber[], searchTerm: string) => {
  if (!searchTerm) {
    return subscribers;
  }
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  return subscribers.filter(subscriber => {
    const emailMatch = subscriber.email?.toLowerCase().includes(lowerCaseSearchTerm);
    return emailMatch;
  });
};

export const fetchSubscribers = async (): Promise<{ data: Subscriber[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching subscribers:", error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Unexpected error fetching subscribers:", error);
    return { data: null, error };
  }
};
