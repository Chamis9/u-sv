
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/features/language";
import { toast } from "sonner";
import { AddTicketData, Ticket } from "./types";

export const useTicketMutations = (eventId?: string) => {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

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
          description: ticketData.description || null,
          file_path: ticketData.file_path || null
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

  const deleteTicket = useMutation({
    mutationFn: async (ticketId: string): Promise<void> => {
      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }
      
      const { data: ticketData, error: fetchError } = await supabase
        .from('tickets')
        .select('file_path')
        .eq('id', ticketId)
        .eq('user_id', user?.id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching ticket data:', fetchError);
      } else if (ticketData?.file_path) {
        const { error: storageError } = await supabase.storage
          .from('ticket_files')
          .remove([ticketData.file_path]);
          
        if (storageError) {
          console.error('Error deleting ticket file:', storageError);
        }
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
    addTicket,
    deleteTicket,
    purchaseTicket
  };
};
