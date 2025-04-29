
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
  category: string; // Transformed from categories relation
  start_date: string;
  end_date: string | null;
  price_range: any;
  venue_id: string | null;
  image_url: string | null;
  status: string | null;
  categories?: { name: string } | null;
}

export const useEvents = (categoryName?: string) => {
  return useQuery({
    queryKey: ['events', categoryName],
    queryFn: async (): Promise<Event[]> => {
      let query = supabase.from('events').select('*, categories(name)');
      
      if (categoryName) {
        query = query.eq('categories.name', categoryName);
      }
      
      const { data, error } = await query
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      
      // Transform the data to match the Event interface
      const transformedData: Event[] = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        category_id: event.category_id,
        // Get category from the categories relation
        category: event.categories?.name || '',
        start_date: event.start_date,
        end_date: event.end_date,
        price_range: event.price_range,
        venue_id: event.venue_id,
        image_url: event.image_url,
        status: event.status,
        categories: event.categories
      }));
      
      return transformedData || [];
    }
  });
};
