
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "./types";
import { toast } from "sonner";
import { useLanguage } from "@/features/language";

export const useEventTickets = (eventId?: string) => {
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  const { data, isLoading, error } = useQuery({
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
        toast.error(t('Kļūda ielādējot biļetes', 'Error loading tickets'));
        throw error;
      }
      
      return data as Ticket[];
    },
    enabled: !!eventId
  });

  return {
    tickets: data || [],
    isLoading,
    error
  };
};
