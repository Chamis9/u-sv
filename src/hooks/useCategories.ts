
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  priority: number;
  status: string; // 'active' | 'hidden'
}

export const useCategories = (includeHidden = false) => {
  return useQuery({
    queryKey: ['categories', includeHidden],
    queryFn: async (): Promise<Category[]> => {
      const query = supabase
        .from('categories')
        .select('*');
      
      // Only filter by active status if we don't want to include hidden categories
      // This is now enforced by RLS policies for anonymous users
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
    }
  });
};
