
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "@/hooks/tickets";
import { useLanguage } from "@/features/language";
import { toast } from "@/hooks/use-toast";

export const useTicketPurchase = () => {
  const { currentLanguage } = useLanguage();
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  const openPurchaseDialog = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
    setIsPurchaseDialogOpen(true);
  };

  const purchaseTicket = async (ticket: UserTicket) => {
    try {
      // Get the current user's ID
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        throw new Error("No authenticated user found");
      }
      
      // Determine the correct table for this ticket
      const tableName = getCategoryTableName(ticket.category);
      if (!tableName) {
        throw new Error(`Invalid ticket category: ${ticket.category}`);
      }
      
      // Update the ticket status in the specific table
      // Use type assertion to satisfy TypeScript
      const { error } = await supabase
        .from(tableName as any)
        .update({ 
          status: 'sold',
          buyer_id: userId
        })
        .eq('id', ticket.id);

      if (error) {
        throw error;
      }
      
      setIsPurchaseDialogOpen(false);
      
      toast({
        title: currentLanguage.code === 'lv' ? "Biļete nopirkta!" : "Ticket purchased!",
        description: currentLanguage.code === 'lv' 
          ? "Biļete ir veiksmīgi pievienota jūsu kontam" 
          : "The ticket has been successfully added to your account",
        variant: "default"
      });
      
      return true;
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      toast({
        title: currentLanguage.code === 'lv' ? "Kļūda" : "Error",
        description: currentLanguage.code === 'lv'
          ? "Neizdevās iegādāties biļeti. Lūdzu, mēģiniet vēlreiz."
          : "Failed to purchase ticket. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Helper function to get table name from category
  const getCategoryTableName = (category: string): string | null => {
    const categoryMapping: Record<string, string> = {
      'Theatre': 'tickets_theatre',
      'Teātris': 'tickets_theatre',
      'Concerts': 'tickets_concerts',
      'Koncerti': 'tickets_concerts',
      'Sports': 'tickets_sports',
      'Festivals': 'tickets_festivals',
      'Festivāli': 'tickets_festivals',
      'Cinema': 'tickets_cinema',
      'Kino': 'tickets_cinema',
      'Children': 'tickets_children',
      'Bērniem': 'tickets_children',
      'Travel': 'tickets_travel',
      'Ceļojumi': 'tickets_travel',
      'Gift Cards': 'tickets_giftcards',
      'Dāvanu kartes': 'tickets_giftcards',
      'Other': 'tickets_other',
      'Citi': 'tickets_other'
    };
    
    return categoryMapping[category] || 'tickets_other';
  };

  return {
    selectedTicket,
    isPurchaseDialogOpen,
    setIsPurchaseDialogOpen,
    openPurchaseDialog,
    purchaseTicket
  };
};
