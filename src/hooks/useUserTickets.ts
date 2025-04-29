
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/features/language";
import { useTicketStorage } from "@/hooks/useTicketStorage";

export interface UserTicket {
  id: string;
  title: string;
  description?: string;
  category: string;
  price: number;
  event_id: string | null;
  status: 'available' | 'sold' | 'expired';
  file_path?: string;
  created_at: string;
}

export interface AddTicketData {
  title: string;
  description?: string | null;
  event_id: string | null;
  price: number;
  user_id: string;
  file_path?: string | null;
  seat_info?: string | null;
  category_name?: string;
  category_id?: string;
  quantity?: number;
}

export function useUserTickets(userId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const { deleteTicketFile } = useTicketStorage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  // Fetch user tickets
  const { data: tickets = [], isLoading, error } = useQuery({
    queryKey: ['user-tickets', userId],
    queryFn: async (): Promise<UserTicket[]> => {
      if (!userId) return [];
      
      // Use a direct SQL query with RPC instead
      const { data, error } = await supabase
        .from('tickets')
        .select('*, categories(name)')
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      // Transform the data to match UserTicket interface
      return data.map(ticket => ({
        id: ticket.id,
        title: ticket.description || "Custom Ticket",
        description: ticket.description,
        category: ticket.categories?.name || "Other",
        price: ticket.price,
        event_id: ticket.event_id,
        status: ticket.status as 'available' | 'sold' | 'expired',
        file_path: ticket.file_path,
        created_at: ticket.created_at
      })) || [];
    },
    enabled: !!userId
  });
  
  // Add a new ticket
  const addTicketMutation = useMutation({
    mutationFn: async (ticketData: AddTicketData) => {
      setLoading(true);
      
      try {
        // Create the ticket (custom tickets don't have event_id)
        const { data, error } = await supabase
          .from('tickets')
          .insert([{
            description: ticketData.title,
            price: ticketData.price,
            user_id: ticketData.user_id,
            file_path: ticketData.file_path,
            seat_info: ticketData.seat_info,
            status: 'available',
            category_id: ticketData.category_id,
            event_id: null
          }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-tickets', userId] });
      toast({
        title: t('Biļete pievienota', 'Ticket Added'),
        description: t('Biļete ir veiksmīgi pievienota pārdošanai', 'Your ticket has been successfully added for sale'),
      });
    },
    onError: (error: any) => {
      console.error('Error adding ticket:', error);
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: error?.message || t('Neizdevās pievienot biļeti', 'Failed to add ticket'),
      });
    }
  });
  
  // Delete a ticket
  const deleteTicketMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      setLoading(true);
      
      try {
        // First get the ticket to check for file_path
        const { data: ticketData, error: fetchError } = await supabase
          .from('tickets')
          .select('file_path')
          .eq('id', ticketId)
          .single();
        
        if (fetchError) throw fetchError;
        
        // If there's a file associated with the ticket, delete it
        if (ticketData?.file_path) {
          await deleteTicketFile(ticketData.file_path);
        }
        
        // Now delete the ticket
        const { error } = await supabase
          .from('tickets')
          .delete()
          .eq('id', ticketId);
        
        if (error) throw error;
        return true;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-tickets', userId] });
      toast({
        title: t('Biļete dzēsta', 'Ticket Deleted'),
        description: t('Biļete ir veiksmīgi dzēsta', 'Your ticket has been successfully deleted'),
      });
    },
    onError: (error: any) => {
      console.error('Error deleting ticket:', error);
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: error?.message || t('Neizdevās dzēst biļeti', 'Failed to delete ticket'),
      });
    }
  });
  
  return {
    tickets,
    isLoading,
    error,
    loading,
    addTicket: addTicketMutation.mutate,
    deleteTicket: deleteTicketMutation.mutate
  };
}
