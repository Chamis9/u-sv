
import { supabase } from '@/integrations/supabase/client';
import type { Subscriber } from '@/types/subscribers';
import { logActivity } from '@/utils/activityLogger';

/**
 * Adds a new subscriber to the newsletter
 */
export const addSubscriber = async (email: string) => {
  try {
    console.log('Attempting to add subscriber with email:', email);
    
    // Explicitly use the anon key for newsletter subscriptions
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email })
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        console.log('Email already subscribed:', email);
        return { success: false, error: 'Email already subscribed', data: null };
      }
      console.error('Error subscribing:', error.message, error.details, error.hint);
      return { success: false, error: error.message, data: null };
    }
    
    // Log the activity - ensure this runs, even if there's an issue with data
    try {
      await logActivity({
        activityType: 'subscriber',
        description: 'New subscriber added',
        email
      });
      console.log('Activity logged for new subscriber:', email);
    } catch (logError) {
      console.error('Failed to log activity for subscriber:', logError);
    }
    
    console.log('Successfully added subscriber:', email);
    return { success: true, error: null, data };
  } catch (error: any) {
    console.error('Subscription error:', error.message, error);
    return { success: false, error: error.message || 'Error adding subscriber', data: null };
  }
};

/**
 * Filters subscribers based on search term
 */
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

/**
 * Fetches all subscribers from the database
 */
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
