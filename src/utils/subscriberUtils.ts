
import { supabase } from '@/integrations/supabase/client';
import { Subscriber } from '@/hooks/useSubscribers';

/**
 * Fetches all subscribers from the database
 */
export async function fetchSubscribers(): Promise<{ data: Subscriber[] | null; error: Error | null }> {
  try {
    console.log("Fetching subscribers from Supabase...");
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log("Raw Supabase response:", { data, error });
    
    if (error) {
      console.error("Supabase error:", error);
      return { data: null, error };
    }
    
    console.log("Subscribers data received:", data);
    return { data, error: null };
  } catch (err) {
    console.error('Error fetching subscribers:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

/**
 * Deletes a subscriber from the database
 */
export async function deleteSubscriber(id: number): Promise<{ success: boolean; error: Error | null }> {
  try {
    console.log("Deleting subscriber with ID:", id);
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting subscriber:", error);
      return { success: false, error };
    }
    
    console.log("Subscriber deleted successfully");
    return { success: true, error: null };
  } catch (err) {
    console.error('Error deleting subscriber:', err);
    return { success: false, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

/**
 * Filters subscribers based on search term
 */
export function filterSubscribers(subscribers: Subscriber[], term: string): Subscriber[] {
  if (!term || term.trim() === "") {
    return subscribers;
  }
  
  const normalizedTerm = term.toLowerCase().trim();
  return subscribers.filter(subscriber => 
    subscriber.email && subscriber.email.toLowerCase().includes(normalizedTerm)
  );
}

/**
 * Generates CSV content from subscribers data
 */
export function generateSubscribersCSV(
  subscribers: Subscriber[], 
  headers: string[], 
  locale: string = 'en-US'
): string {
  if (!subscribers || subscribers.length === 0) {
    // Return just headers if no subscribers
    return headers.join(',');
  }
  
  const csvContent = [
    headers,
    ...subscribers.map(sub => [
      sub.id, 
      sub.email || '', 
      sub.created_at ? new Date(sub.created_at).toLocaleDateString(locale) : ''
    ])
  ]
  .map(row => row.join(','))
  .join('\n');
  
  return csvContent;
}

/**
 * Creates and triggers download of CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
