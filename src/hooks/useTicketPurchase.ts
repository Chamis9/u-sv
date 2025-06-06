
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
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error(`Authentication error: ${userError.message}`);
      }
      
      const userId = userData.user?.id;
      
      if (!userId) {
        throw new Error("No authenticated user found");
      }
      
      console.log(`Purchasing ticket: ${ticket.id} for user: ${userId}`);
      
      // Use RPC function to update ticket status to handle RLS properly
      const { data, error } = await supabase.rpc('purchase_ticket', {
        ticket_id: ticket.id,
        buyer_user_id: userId
      });

      if (error) {
        console.error("RPC error:", error);
        // If RPC doesn't exist, fall back to direct update with service role
        const { error: updateError } = await supabase
          .from('tickets')
          .update({ 
            status: 'sold',
            buyer_id: userId
          })
          .eq('id', ticket.id)
          .eq('status', 'available'); // Only update if still available
        
        if (updateError) {
          throw updateError;
        }
      }
      
      setIsPurchaseDialogOpen(false);
      
      const messages = {
        lv: {
          title: "Biļete nopirkta!",
          description: "Biļete ir veiksmīgi pievienota jūsu kontam"
        },
        en: {
          title: "Ticket purchased!",
          description: "The ticket has been successfully added to your account"
        },
        lt: {
          title: "Bilietas nupirktas!",
          description: "Bilietas sėkmingai pridėtas prie jūsų paskyros"
        },
        et: {
          title: "Pilet ostetud!",
          description: "Pilet on edukalt teie kontole lisatud"
        },
        ee: {
          title: "Pilet ostetud!",
          description: "Pilet on edukalt teie kontole lisatud"
        }
      };
      
      const message = messages[currentLanguage.code as keyof typeof messages] || messages.lv;
      
      toast({
        title: message.title,
        description: message.description,
        variant: "default"
      });
      
      return true;
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      
      const errorMessages = {
        lv: {
          title: "Kļūda",
          description: "Neizdevās iegādāties biļeti. Lūdzu, mēģiniet vēlreiz."
        },
        en: {
          title: "Error",
          description: "Failed to purchase ticket. Please try again."
        },
        lt: {
          title: "Klaida",
          description: "Nepavyko įsigyti bilieto. Bandykite dar kartą."
        },
        et: {
          title: "Viga",
          description: "Pileti ostmine ebaõnnestus. Palun proovige uuesti."
        },
        ee: {
          title: "Viga",
          description: "Pileti ostmine ebaõnnestus. Palun proovige uuesti."
        }
      };
      
      const errorMessage = errorMessages[currentLanguage.code as keyof typeof errorMessages] || errorMessages.lv;
      
      toast({
        title: errorMessage.title,
        description: errorMessage.description,
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
