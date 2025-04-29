
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
}

export const useEvents = (category?: string) => {
  return useQuery({
    queryKey: ['events', category],
    queryFn: async (): Promise<Event[]> => {
      let query = supabase.from('events').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};
