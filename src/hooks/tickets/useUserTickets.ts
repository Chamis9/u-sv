
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "./types";
import { useAuth } from "@/contexts/AuthContext";

export const useUserTickets = () => {
  const { isAuthenticated, user } = useAuth();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-tickets'],
    queryFn: async (): Promise<Ticket[]> => {
      if (!isAuthenticated || !user) return [];
      
      const { data, error } = await supabase
        .from('tickets')
        .select('*, events(title, start_date)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user tickets:', error);
        throw error;
      }
      
      // Ensure each ticket has a quantity value, defaulting to 1 if not present
      // Using type assertion to handle the TypeScript error
      const ticketsWithQuantity = data.map(ticket => ({
        ...ticket,
        quantity: 'quantity' in ticket ? ticket.quantity : 1
      })) as Ticket[];
      
      return ticketsWithQuantity;
    },
    enabled: isAuthenticated && !!user
  });

  return {
    userTickets: data || [],
    isLoading,
    error
  };
};
