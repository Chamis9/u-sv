
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
      // Get the current user's auth ID
      const { data: userData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !userData.user?.id) {
        console.error("Auth error:", authError);
        throw new Error("No authenticated user found");
      }
      
      console.log("Auth user ID:", userData.user.id);
      
      // Get the registered_user record for the authenticated user
      const { data: registeredUser, error: registeredUserError } = await supabase
        .from('registered_users')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();
        
      if (registeredUserError || !registeredUser) {
        console.error("Error getting registered user:", registeredUserError);
        throw new Error("User profile not found");
      }
      
      console.log(`Purchasing ticket: ${ticket.id} for registered user: ${registeredUser.id}`);
      
      // Update the ticket status in the tickets table using registered_user.id
      const { error: updateError } = await supabase
        .from('tickets')
        .update({ 
          status: 'sold',
          buyer_id: registeredUser.id,
          owner_id: registeredUser.id
        })
        .eq('id', ticket.id);

      if (updateError) {
        console.error("Error updating ticket:", updateError);
        throw updateError;
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

  return {
    selectedTicket,
    isPurchaseDialogOpen,
    setIsPurchaseDialogOpen,
    openPurchaseDialog,
    purchaseTicket
  };
};
