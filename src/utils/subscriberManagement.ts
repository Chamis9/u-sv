
import { supabase } from "@/integrations/supabase/client";
import { Subscriber } from "@/types/subscribers";
import { logActivity } from '@/utils/activityLogger';

/**
 * Centralized subscriber utilities to replace duplicated functionality
 */

// Filter subscribers based on search term
export const filterSubscribers = (subscribers: Subscriber[], searchTerm: string): Subscriber[] => {
  if (!searchTerm.trim()) {
    return subscribers;
  }
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return subscribers.filter(subscriber => 
    subscriber.email.toLowerCase().includes(lowerSearchTerm) ||
    subscriber.id.toString().includes(lowerSearchTerm) ||
    (subscriber.created_at && new Date(subscriber.created_at)
      .toLocaleDateString()
      .includes(lowerSearchTerm))
  );
};

// Delete a subscriber
export const deleteSubscriber = async (id: number, email: string): Promise<{success: boolean, error?: string}> => {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    // Log the activity
    logActivity({
      activityType: 'subscriber',
      description: `Subscriber deleted`,
      email: email
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

// Update a subscriber
export const updateSubscriber = async (id: number, email: string, oldEmail: string): Promise<{success: boolean, error?: string}> => {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ email })
      .eq('id', id);
      
    if (error) throw error;
    
    // Log the activity
    logActivity({
      activityType: 'subscriber',
      description: `Subscriber email updated`,
      email: email,
      metadata: { oldEmail }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating subscriber:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

// Create downloadable CSV file from subscribers data
export const createDownloadableCSV = (subscribers: Subscriber[]) => {
  const headers = 'ID,Email,Created At\n';
  
  const rows = subscribers.map(sub => {
    const formattedDate = sub.created_at ? new Date(sub.created_at).toLocaleDateString() : '';
    return `${sub.id},"${sub.email}","${formattedDate}"`;
  }).join('\n');
  
  const csv = headers + rows;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const filename = `subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
  
  return { blob, filename };
};
