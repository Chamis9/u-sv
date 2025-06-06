
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
      
      console.log(`Purchasing ticket: ${ticket.id}`);
      
      // Update the ticket status in the tickets table
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status: 'sold',
          buyer_id: userId
        })
        .eq('id', ticket.id);

      if (error) {
        throw error;
      }
      
      setIsPurchaseDialogOpen(false);
      
      const getSuccessMessage = () => {
        switch (currentLanguage.code) {
          case 'lv': return "Biļete nopirkta!";
          case 'en': return "Ticket purchased!";
          case 'lt': return "Bilietas nupirktas!";
          case 'et':
          case 'ee': return "Pilet ostetud!";
          default: return "Ticket purchased!";
        }
      };

      const getSuccessDescription = () => {
        switch (currentLanguage.code) {
          case 'lv': return "Biļete ir veiksmīgi pievienota jūsu kontam";
          case 'en': return "The ticket has been successfully added to your account";
          case 'lt': return "Bilietas sėkmingai pridėtas prie jūsų paskyros";
          case 'et':
          case 'ee': return "Pilet on edukalt lisatud teie kontole";
          default: return "The ticket has been successfully added to your account";
        }
      };
      
      toast({
        title: getSuccessMessage(),
        description: getSuccessDescription(),
        variant: "default"
      });
      
      return true;
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      
      const getErrorTitle = () => {
        switch (currentLanguage.code) {
          case 'lv': return "Kļūda";
          case 'en': return "Error";
          case 'lt': return "Klaida";
          case 'et':
          case 'ee': return "Viga";
          default: return "Error";
        }
      };

      const getErrorDescription = () => {
        switch (currentLanguage.code) {
          case 'lv': return "Biļešu iegādes iespēja vēl tiek izstrādāta. Paldies par pacietību!";
          case 'en': return "Ticket purchasing functionality is still under development. Thank you for your patience!";
          case 'lt': return "Bilietų pirkimo funkcionalumas vis dar kuriamas. Ačiū už kantrybę!";
          case 'et':
          case 'ee': return "Piletite ostmise funktsioon on veel arendamisel. Täname kannatlikkuse eest!";
          default: return "Ticket purchasing functionality is still under development. Thank you for your patience!";
        }
      };
      
      toast({
        title: getErrorTitle(),
        description: getErrorDescription(),
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
