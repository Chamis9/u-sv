
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/hooks/useEvents";

interface FilterOptions {
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  venueId?: string;
  searchQuery?: string;
}

export const useFilteredEvents = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ['filtered-events', filters],
    queryFn: async (): Promise<Event[]> => {
      let query = supabase.from('events').select(`
        *,
        categories:category_id(name)
      `);
      
      // Apply category filter
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
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
      
      return data || [];
    }
  });
};
