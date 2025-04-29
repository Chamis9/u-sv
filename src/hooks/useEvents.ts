
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  category: string;
  start_date: string;
  end_date: string | null;
  price_range: any;
  venue_id: string | null;
  image_url: string | null;
  status: string | null;
  category_id?: string; // Add this to make it compatible with database
}

export const useEvents = (category?: string) => {
  return useQuery({
    queryKey: ['events', category],
    queryFn: async (): Promise<Event[]> => {
      let query = supabase.from('events')
        .select('*, categories(name)');
      
      if (category) {
        query = query.eq('category_id', category);
      }
      
      const { data, error } = await query
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      
      // Transform data to match Event interface
      const transformedEvents: Event[] = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        category: event.categories?.name || '',
        category_id: event.category_id,
        start_date: event.start_date,
        end_date: event.end_date,
        price_range: event.price_range,
        venue_id: event.venue_id,
        image_url: event.image_url,
        status: event.status
      }));
      
      return transformedEvents || [];
    }
  });
};
