
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  priority: number;
  status: string; // 'active' | 'hidden'
  name_lv: string | null;
  name_en: string | null;
  name_lt: string | null;
  name_ee: string | null;
  description_lv: string | null;
  description_en: string | null;
  description_lt: string | null;
  description_ee: string | null;
}

export const useCategories = (includeHidden = false) => {
  return useQuery({
    queryKey: ['categories', includeHidden],
    queryFn: async (): Promise<Category[]> => {
      const query = supabase
        .from('categories')
        .select('*');
      
      // Only filter by active status if we don't want to include hidden categories
      if (!includeHidden) {
        query.eq('status', 'active');
      }
      
      query.order('priority', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      return data || [];
    },
    staleTime: 1000 * 60, // Consider data stale after 1 minute
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true,      // Refetch when component mounts
  });
};
