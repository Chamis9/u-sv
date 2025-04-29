
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
  
  // Custom fetch function to handle user_tickets table
  const fetchUserTickets = async (): Promise<UserTicket[]> => {
    // This is a direct SQL query because the table may not be in the TypeScript types yet
    const { data: tickets, error } = await supabase
      .rpc('get_user_tickets')
      .select('*');
    
    if (error) {
      console.error('Error fetching user tickets:', error);
      // Fallback: try a raw table query if the RPC doesn't exist
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('user_tickets')
        .select('*');

      if (fallbackError) throw fallbackError;
      return fallbackData as UserTicket[];
    }
    
    return tickets as UserTicket[];
  };
  
  // Get all tickets for display in categories
  const { data: allTickets, isLoading: isLoadingAll } = useQuery({
    queryKey: ['user_tickets'],
    queryFn: async (): Promise<UserTicket[]> => {
      try {
        // This is a direct SQL query because the table may not be in the TypeScript types yet
        const { data, error } = await supabase
          .from('user_tickets')
          .select('*')
          .eq('status', 'available')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as UserTicket[];
      } catch (error) {
        console.error('Error fetching all tickets:', error);
        return [];
      }
    },
    enabled: true
  });
  
  // Get tickets by category
  const getTicketsByCategory = (category: string) => {
    return allTickets?.filter(ticket => ticket.category.toLowerCase() === category.toLowerCase()) || [];
  };
  
  // Get user's tickets
  const { data: userTickets, isLoading: isLoadingUser } = useQuery({
    queryKey: ['userTickets', user?.id],
    queryFn: async (): Promise<UserTicket[]> => {
      if (!user) return [];
      
      try {
        // This is a direct SQL query because the table may not be in the TypeScript types yet
        const { data, error } = await supabase
          .from('user_tickets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as UserTicket[];
      } catch (error) {
        console.error('Error fetching user tickets:', error);
        return [];
      }
    },
    enabled: !!user
  });
  
  // Add new ticket
  const addTicket = useMutation({
    mutationFn: async (ticketData: AddTicketData): Promise<UserTicket> => {
      if (!user) throw new Error('User not authenticated');
      
      try {
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
        return data as UserTicket;
      } catch (error) {
        console.error('Error adding ticket:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_tickets'] });
      queryClient.invalidateQueries({ queryKey: ['userTickets', user?.id] });
    }
  });
  
  // Delete ticket
  const deleteTicket = useMutation({
    mutationFn: async (ticketId: string): Promise<void> => {
      if (!user) throw new Error('User not authenticated');
      
      try {
        const { error } = await supabase
          .from('user_tickets')
          .delete()
          .eq('id', ticketId)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting ticket:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_tickets'] });
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
