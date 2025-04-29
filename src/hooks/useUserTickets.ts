
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserTicket {
  id: string;
  title: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  image_url?: string;
  file_path?: string;
  event_date?: string;
  created_at: string;
  updated_at: string;
  status: string;
  user_id: string;
}

export interface AddTicketData {
  title: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  image_url?: string;
  file_path?: string;
  event_date?: string;
}

export const useUserTickets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Get all tickets for display in categories
  const { data: allTickets, isLoading: isLoadingAll } = useQuery({
    queryKey: ['tickets'],
    queryFn: async (): Promise<UserTicket[]> => {
      const { data, error } = await supabase
        .from('user_tickets')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: true
  });
  
  // Get tickets by category
  const getTicketsByCategory = (category: string) => {
    return allTickets?.filter(ticket => ticket.category === category) || [];
  };
  
  // Get user's tickets
  const { data: userTickets, isLoading: isLoadingUser } = useQuery({
    queryKey: ['userTickets', user?.id],
    queryFn: async (): Promise<UserTicket[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });
  
  // Add new ticket
  const addTicket = useMutation({
    mutationFn: async (ticketData: AddTicketData): Promise<UserTicket> => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_tickets')
        .insert([
          {
            ...ticketData,
            user_id: user.id
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['userTickets', user?.id] });
    }
  });
  
  // Delete ticket
  const deleteTicket = useMutation({
    mutationFn: async (ticketId: string): Promise<void> => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_tickets')
        .delete()
        .eq('id', ticketId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['userTickets', user?.id] });
    }
  });
  
  return {
    allTickets,
    isLoadingAll,
    userTickets,
    isLoadingUser,
    getTicketsByCategory,
    addTicket,
    deleteTicket
  };
};
