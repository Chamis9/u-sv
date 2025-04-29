
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketFormSchema, TicketFormValues } from "../schema";
import { useAuth } from "@/contexts/AuthContext";
import { useTicketStorage } from "@/hooks/tickets";
import { useUserTickets } from "@/hooks/tickets";
import { getCategoryByName } from "../services/CategoryService";
import { useLanguage } from "@/features/language";

export function useTicketForm({ onClose }: { onClose: () => void }) {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
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
      category: "other",
      venue: ""
    },
  });
  
  const isLoading = fileUploading || ticketLoading;
  
  const handleSubmit = async (values: TicketFormValues) => {
    if (!user) {
      return;
    }
    
    try {
      let filePath = null;
      
      if (file) {
        const uploadResult = await uploadTicketFile(file, user.id);
        if (uploadResult) {
          filePath = uploadResult.path;
        }
      }
      
      const category = await getCategoryByName(values.category);
      
      // Format event date if provided
      const formattedEventDate = values.eventDate ? values.eventDate.toISOString().split('T')[0] : null;
      
      addTicket({
        title: values.title,
        description: values.description,
        price: Number(values.price),
        user_id: user.id,
        file_path: filePath,
        category_name: values.category,
        category_id: category?.id,
        event_id: null,
        event_date: formattedEventDate,
        venue: values.venue
      });
      
      onClose();
      
    } catch (err: any) {
      console.error("Error adding ticket:", err);
      form.setError("root", { 
        message: t(
          "Kļūda pievienojot biļeti", 
          "Error adding ticket"
        ) 
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
