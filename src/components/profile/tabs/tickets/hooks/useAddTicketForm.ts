
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/features/language";
import { AddTicketData, UserTicket } from "@/hooks/tickets";
import { TicketFormValues } from "../schema";
import { useTicketRefresh } from "./useTicketRefresh";
import { useAuth } from "@/contexts/AuthContext";

interface UseAddTicketFormProps {
  form: UseFormReturn<TicketFormValues>;
  userId?: string;
  onClose: () => void;
  isEditing?: boolean;
  ticketToEdit?: UserTicket;
  addTicket?: (data: AddTicketData) => Promise<{ success: boolean; ticket?: UserTicket; error?: string }>;
  updateTicket?: (ticketId: string, data: Partial<AddTicketData>) => Promise<{ success: boolean; ticket?: UserTicket; error?: string }>;
  uploadTicketFile?: (file: File) => Promise<{ path?: string; error?: string }>;
}

export function useAddTicketForm({
  form,
  userId,
  onClose,
  isEditing = false,
  ticketToEdit,
  addTicket,
  updateTicket,
  uploadTicketFile
}: UseAddTicketFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  // Get the ticket refresh function
  const { refreshTickets } = useTicketRefresh({ userId, isAuthenticated });
  
  const t = (lvText: string, enText: string, ltText: string, eeText: string) => {
    switch (currentLanguage.code) {
      case 'lv': return lvText;
      case 'en': return enText;
      case 'lt': return ltText;
      case 'et':
      case 'ee': return eeText;
      default: return lvText;
    }
  };
  
  const onSubmit = async (values: TicketFormValues) => {
    if (!userId) {
      toast({
        title: t("Kļūda", "Error", "Klaida", "Viga"),
        description: t(
          "Lai pievienotu biļeti, lūdzu pieslēdzieties", 
          "Please log in to add a ticket",
          "Norėdami pridėti bilietą, prisijunkite",
          "Pileti lisamiseks palun sisse logida"
        ),
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      let filePath = undefined;
      
      // Handle file upload if a file was selected
      if (values.file && uploadTicketFile) {
        const uploadResult = await uploadTicketFile(values.file);
        if (uploadResult.error) {
          toast({
            title: t(
              "Kļūda augšupielādējot failu", 
              "File upload error",
              "Failo įkėlimo klaida",
              "Faili üleslaadimisel viga"
            ),
            description: uploadResult.error,
            variant: "destructive",
          });
          setSubmitting(false);
          return;
        }
        filePath = uploadResult.path;
      }
      
      // Calculate total price based on price per unit and quantity
      const pricePerUnit = parseFloat(values.pricePerUnit);
      const quantity = parseInt(values.quantity);
      const totalPrice = pricePerUnit * quantity;
      
      // Prepare ticket data
      const ticketData: AddTicketData = {
        title: values.title,
        description: values.description || undefined,
        price: totalPrice,
        user_id: userId,
        category_name: values.category,
        event_date: values.eventDate || undefined,
        venue: values.venue || undefined,
        quantity: quantity,
        price_per_unit: pricePerUnit,
        event_time: values.eventTime || undefined
      };
      
      // If we have a file path, add it
      if (filePath) {
        ticketData.file_path = filePath;
      } else if (isEditing && ticketToEdit?.file_path) {
        // Keep existing file path when editing
        ticketData.file_path = ticketToEdit.file_path;
      }
      
      let success = false;
      
      if (isEditing && ticketToEdit && updateTicket) {
        // Update existing ticket
        const updateResult = await updateTicket(ticketToEdit.id, ticketData);
        success = updateResult.success;
        
        if (!success) {
          toast({
            title: t("Kļūda", "Error", "Klaida", "Viga"),
            description: updateResult.error || t(
              "Kļūda atjauninot biļeti. Lūdzu mēģiniet vēlreiz.", 
              "Failed to update ticket. Please try again.",
              "Nepavyko atnaujinti bilieto. Bandykite dar kartą.",
              "Pileti uuendamine ebaõnnestus. Palun proovige uuesti."
            ),
            variant: "destructive",
          });
          setSubmitting(false);
          return;
        }
        
        toast({
          title: t("Biļete atjaunināta", "Ticket updated", "Bilietas atnaujintas", "Pilet uuendatud"),
          description: t(
            "Biļetes informācija ir veiksmīgi atjaunināta", 
            "Ticket information has been successfully updated",
            "Bilieto informacija sėkmingai atnaujinta",
            "Pileti andmed on edukalt uuendatud"
          ),
        });
      } else if (addTicket) {
        // Add new ticket
        const { success: addSuccess, error } = await addTicket(ticketData);
        success = addSuccess;
        
        if (!success) {
          toast({
            title: t("Kļūda", "Error", "Klaida", "Viga"),
            description: error || t(
              "Kļūda pievienojot biļeti. Lūdzu mēģiniet vēlreiz.", 
              "Failed to add ticket. Please try again.",
              "Nepavyko pridėti bilieto. Bandykite dar kartą.",
              "Pileti lisamine ebaõnnestus. Palun proovige uuesti."
            ),
            variant: "destructive",
          });
          setSubmitting(false);
          return;
        }
        
        toast({
          title: t("Biļete pievienota", "Ticket added", "Bilietas pridėtas", "Pilet lisatud"),
          description: t(
            "Biļete ir veiksmīgi pievienota", 
            "Ticket has been successfully added",
            "Bilietas sėkmingai pridėtas",
            "Pilet on edukalt lisatud"
          ),
        });
      }
      
      if (success) {
        // Force refresh the tickets list
        await refreshTickets();
        onClose();
      }
    } catch (error) {
      console.error("Error handling ticket submission:", error);
      toast({
        title: t("Kļūda", "Error", "Klaida", "Viga"),
        description: t(
          "Nezināma kļūda. Lūdzu mēģiniet vēlreiz.", 
          "Unknown error. Please try again.",
          "Nežinoma klaida. Bandykite dar kartą.",
          "Tundmatu viga. Palun proovige uuesti."
        ),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return {
    submitting,
    onSubmit,
    t
  };
}
