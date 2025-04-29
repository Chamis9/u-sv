
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
  start_date: string;
  end_date: string | null;
  price_range: any;
  venue_id: string | null;
  image_url: string | null;
  status: string | null;
  created_by: string | null;
  tickets?: any[];
  ticketCount?: number;
}

export const useEvents = (categoryId?: string, includeUserListings = false) => {
  return useQuery({
    queryKey: ['events', categoryId, includeUserListings],
    queryFn: async (): Promise<Event[]> => {
      let query = supabase.from('events').select(`
        *,
        categories:category_id(name),
        tickets(count)
      `);
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      // Include user listings if requested
      if (includeUserListings) {
        query = query.in('status', ['published', 'temp_listing']);
      } else {
        query = query.eq('status', 'published');
      }
      
      const { data, error } = await query
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      
      // Post-process the results to add ticket count
      const processedData = data?.map(event => ({
        ...event,
        ticketCount: event.tickets ? event.tickets.length : 0
      })) || [];
      
      return processedData;
    }
  });
};
