
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useLanguage } from "@/features/language";

export interface Ticket {
  id: string;
  user_id: string;
  event_id: string;
  price: number;
  seat_info: string | null;
  description: string | null;
  status: 'available' | 'sold' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface AddTicketData {
  event_id: string;
  price: number;
  seat_info?: string;
  description?: string;
}

export const useTickets = (eventId?: string) => {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguage();
  
  // Translate helper
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  // Get all available tickets for an event
  const getEventTickets = useQuery({
    queryKey: ['tickets', eventId],
    queryFn: async (): Promise<Ticket[]> => {
      if (!eventId) return [];
      
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('event_id', eventId)
        .eq('status', 'available')
        .order('price', { ascending: true });
      
      if (error) {
        console.error('Error fetching tickets:', error);
        throw error;
      }
      
      return data as Ticket[];
    },
    enabled: !!eventId
  });

  // Get user's tickets (for "My Tickets" section)
  const getUserTickets = useQuery({
    queryKey: ['user-tickets'],
    queryFn: async (): Promise<Ticket[]> => {
      if (!isAuthenticated || !user) return [];
      
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user tickets:', error);
        throw error;
      }
      
      return data as Ticket[];
    },
    enabled: isAuthenticated && !!user
  });

  // Get user's purchased tickets
  const getUserPurchases = useQuery({
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

  // Add a new ticket
  const addTicket = useMutation({
    mutationFn: async (ticketData: AddTicketData): Promise<Ticket> => {
      if (!isAuthenticated || !user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          event_id: ticketData.event_id,
          user_id: user.id,
          price: ticketData.price,
          seat_info: ticketData.seat_info || null,
          description: ticketData.description || null
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error adding ticket:', error);
        throw error;
      }
      
      return data as Ticket;
    },
    onSuccess: () => {
      toast.success(t('Biļete veiksmīgi pievienota', 'Ticket successfully added'));
      queryClient.invalidateQueries({ queryKey: ['user-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', eventId] });
    },
    onError: (error) => {
      toast.error(t('Kļūda pievienojot biļeti', 'Error adding ticket') + ': ' + error.message);
    }
  });
  
  // Delete ticket
  const deleteTicket = useMutation({
    mutationFn: async (ticketId: string): Promise<void> => {
      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', ticketId)
        .eq('user_id', user?.id);
      
      if (error) {
        console.error('Error deleting ticket:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(t('Biļete dzēsta', 'Ticket deleted'));
      queryClient.invalidateQueries({ queryKey: ['user-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', eventId] });
    },
    onError: (error) => {
      toast.error(t('Kļūda dzēšot biļeti', 'Error deleting ticket') + ': ' + error.message);
    }
  });
  
  // Purchase a ticket
  const purchaseTicket = useMutation({
    mutationFn: async ({ ticketId, sellerId }: { ticketId: string, sellerId: string }): Promise<void> => {
      if (!isAuthenticated || !user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('ticket_purchases')
        .insert({
          ticket_id: ticketId,
          buyer_id: user.id,
          seller_id: sellerId
        });
      
      if (error) {
        console.error('Error purchasing ticket:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(t('Biļete veiksmīgi iegādāta', 'Ticket successfully purchased'));
      queryClient.invalidateQueries({ queryKey: ['user-purchases'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', eventId] });
    },
    onError: (error) => {
      toast.error(t('Kļūda iegādājoties biļeti', 'Error purchasing ticket') + ': ' + error.message);
    }
  });

  return {
    eventTickets: getEventTickets.data || [],
    userTickets: getUserTickets.data || [],
    userPurchases: getUserPurchases.data || [],
    isLoadingEventTickets: getEventTickets.isLoading,
    isLoadingUserTickets: getUserTickets.isLoading,
    isLoadingUserPurchases: getUserPurchases.isLoading,
    addTicket,
    deleteTicket,
    purchaseTicket
  };
};
