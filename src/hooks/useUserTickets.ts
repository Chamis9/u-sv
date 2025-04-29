
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/features/language";

export interface UserTicket {
  id: string;
  title: string;
  description?: string;
  category: string;
  price: number;
  event_id: string;
  status: 'available' | 'sold' | 'expired';
  file_path?: string;
  created_at: string;
}

export interface AddTicketData {
  title: string;
  description?: string;
  eventId: string;
  price: number;
  file?: File;
}

export function useUserTickets(userId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  // Fetch user tickets
  const { data: tickets = [], isLoading, error } = useQuery({
    queryKey: ['user-tickets', userId],
    queryFn: async (): Promise<UserTicket[]> => {
      if (!userId) return [];
      
      // Use a direct SQL query with RPC instead
      const { data, error } = await supabase
        .from('tickets')
        .select('*, events(title, category_id, categories:categories(name))')
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      // Transform the data to match UserTicket interface
      return data.map(ticket => ({
        id: ticket.id,
        title: ticket.events?.title || "Unknown Event",
        description: ticket.description,
        category: ticket.events?.categories?.name || "Other",
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
    mutationFn: async (ticketData: { 
      title: string;
      description: string | null;
      event_id: string;
      price: number;
      user_id: string;
      file_path: string | null;
      seat_info?: string;
    }) => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('tickets')
          .insert([{
            ...ticketData,
            status: 'available'
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
    onError: (error) => {
      console.error('Error adding ticket:', error);
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: t('Neizdevās pievienot biļeti', 'Failed to add ticket'),
      });
    }
  });
  
  // Delete a ticket
  const deleteTicketMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      setLoading(true);
      
      try {
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
    onError: (error) => {
      console.error('Error deleting ticket:', error);
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: t('Neizdevās dzēst biļeti', 'Failed to delete ticket'),
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
