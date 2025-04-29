
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/hooks/useEvents";

interface FilterOptions {
  category?: string;
  startDate?: Date;
  endDate?: Date;
  venueId?: string;
  searchQuery?: string;
}

export const useFilteredEvents = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ['filtered-events', filters],
    queryFn: async (): Promise<Event[]> => {
      let query = supabase.from('events').select('*, categories(name)');
      
      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        query = query.eq('categories.name', filters.category);
      }

      // Apply date filters
      if (filters.startDate) {
        query = query.gte('start_date', filters.startDate.toISOString());
      }
      
      if (filters.endDate) {
        query = query.lte('start_date', filters.endDate.toISOString());
      }

      // Apply venue filter
      if (filters.venueId) {
        query = query.eq('venue_id', filters.venueId);
      }

      // Apply text search on title and description
      if (filters.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }

      // Always show only published events and order by start date
      const { data, error } = await query
        .eq('status', 'published')
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching filtered events:', error);
        throw error;
      }
      
      // Transform the data to match the Event interface
      const transformedData: Event[] = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        category_id: event.category_id,
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
