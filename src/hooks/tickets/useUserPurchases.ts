
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserPurchases = () => {
  const { isAuthenticated, user } = useAuth();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-purchases'],
    queryFn: async () => {
      if (!isAuthenticated || !user) return [];
      
      const { data, error } = await supabase
        .from('ticket_purchases')
        .select(`
          *,
          tickets:ticket_id (*)
        `)
        .eq('buyer_id', user.id)
        .order('purchase_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching user purchases:', error);
        throw error;
      }
      
      return data;
    },
    enabled: isAuthenticated && !!user
  });

  return {
    userPurchases: data || [],
    isLoading,
    error
  };
};
