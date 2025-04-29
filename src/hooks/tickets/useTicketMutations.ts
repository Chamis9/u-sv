
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/features/language";
import { AddTicketData } from "./types";
import { useTicketStorage } from "./useTicketStorage";
import { getCategoryTableName } from "@/components/profile/tabs/tickets/services/CategoryService";

export function useTicketMutations(userId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const { deleteTicketFile } = useTicketStorage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  // Add a new ticket
  const addTicketMutation = useMutation({
    mutationFn: async (ticketData: AddTicketData) => {
      setLoading(true);
      
      try {
        // Get the current authenticated user
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!sessionData.session || !sessionData.session.user) {
          throw new Error(t('Nepieciešama autentifikācija', 'Authentication required'));
        }
        
        // Ensure the user_id matches the authenticated user's id
        const authenticatedUserId = sessionData.session.user.id;
        if (ticketData.user_id !== authenticatedUserId) {
          console.warn("User ID mismatch, using authenticated user ID");
          ticketData.user_id = authenticatedUserId;
        }
        
        console.log("Adding ticket:", ticketData);
        
        // Determine which ticket table to use based on category
        let tableName: string = 'tickets_other';
        
        if (ticketData.category_name) {
          tableName = getCategoryTableName(ticketData.category_name);
        }
        
        console.log(`Using table ${tableName} for ticket category: ${ticketData.category_name}`);
        
        // Create the ticket in the appropriate category table
        const { data, error } = await supabase
          .from(tableName)
          .insert([{
            description: ticketData.title,
            price: ticketData.price,
            user_id: ticketData.user_id,
            file_path: ticketData.file_path,
            seat_info: ticketData.seat_info,
            status: 'available',
            category_id: ticketData.category_id,
            event_id: ticketData.event_id,
            event_date: ticketData.event_date,
            venue: ticketData.venue
          }])
          .select()
          .single();
        
        if (error) {
          console.error(`Error creating ticket in ${tableName}:`, error);
          throw error;
        }
        
        console.log("Ticket created successfully:", data);
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
          .select('file_path, user_id')
          .eq('id', ticketId)
          .single();
        
        if (fetchError) throw fetchError;
        
        // Verify ownership
        if (ticketData.user_id !== userId) {
          throw new Error(t('Nevar dzēst cita lietotāja biļeti', 'Cannot delete another user\'s ticket'));
        }
        
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
        
        console.log("Ticket deleted successfully:", ticketId);
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
    loading,
    addTicket: addTicketMutation.mutate,
    deleteTicket: deleteTicketMutation.mutate
  };
}
