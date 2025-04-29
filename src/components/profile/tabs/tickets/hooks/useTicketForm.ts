
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketFormSchema, TicketFormValues } from "../schema";
import { useAuth } from "@/contexts/AuthContext";
import { useTicketStorage } from "@/hooks/tickets";
import { useUserTickets } from "@/hooks/tickets";
import { getCategoryIdByName } from "../services/CategoryService";
import { useLanguage } from "@/features/language";
import { useToast } from "@/hooks/use-toast";
import { getCategoryTableName } from "@/utils/categoryMapping";

export function useTicketForm({ onClose }: { onClose: () => void }) {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadTicketFile, uploading: fileUploading } = useTicketStorage();
  const { addTicket, loading: ticketLoading } = useUserTickets(user?.id);
  const [file, setFile] = useState<File | null>(null);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: "",
      price: "",
      description: "",
      category: "",
      venue: ""
    },
  });
  
  const isLoading = fileUploading || ticketLoading;
  
  const handleSubmit = async (values: TicketFormValues) => {
    if (!user) {
      toast({
        title: t("Kļūda", "Error"),
        description: t("Lietotājs nav autorizēts", "User is not authenticated"),
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log("Submitting form with values:", values);
      
      let filePath = null;
      
      // Upload file if provided
      if (file) {
        console.log("Uploading file:", file.name);
        const uploadResult = await uploadTicketFile(file, user.id);
        if (uploadResult) {
          filePath = uploadResult.path;
          console.log("File uploaded successfully:", filePath);
        }
      }
      
      // Get or create the category ID
      console.log("Getting category ID for:", values.category);
      const categoryId = await getCategoryIdByName(values.category);
      console.log("Category ID:", categoryId);
      
      if (!categoryId) {
        toast({
          title: t("Kļūda", "Error"),
          description: t("Nevarēja atrast kategoriju", "Could not find or create category"),
          variant: "destructive"
        });
        return;
      }
      
      // Format event date if provided
      const formattedEventDate = values.eventDate ? values.eventDate.toISOString().split('T')[0] : null;
      
      // Determine the correct table name based on the category
      const tableName = getCategoryTableName(values.category);
      console.log(`Using table ${tableName} for category: ${values.category}`);
      
      // Add the ticket - ensure all details are logged
      const result = await addTicket({
        title: values.title,
        description: values.description,
        price: Number(values.price),
        user_id: user.id,
        file_path: filePath,
        category_name: values.category,
        category_id: categoryId,
        event_id: null,
        event_date: formattedEventDate,
        venue: values.venue,
        table_name: tableName // Pass the table name to the addTicket function
      });
      
      console.log("Add ticket result:", result);
      
      toast({
        title: t("Veiksmīgi!", "Success!"),
        description: t("Biļete ir pievienota", "Ticket has been added"),
      });
      
      onClose();
      
    } catch (err: any) {
      console.error("Error adding ticket:", err);
      toast({
        title: t("Kļūda", "Error"),
        description: t("Kļūda pievienojot biļeti", "Error adding ticket"),
        variant: "destructive"
      });
    }
  };
  
  return {
    form,
    file,
    setFile,
    isLoading,
    handleSubmit,
    t
  };
}
