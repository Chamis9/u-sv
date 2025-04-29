
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketFormSchema, TicketFormValues } from "../schema";
import { useAuth } from "@/contexts/AuthContext";
import { useTicketStorage } from "@/hooks/tickets";
import { useUserTickets } from "@/hooks/tickets";
import { getCategoryIdByName } from "../services/CategoryService";
import { useLanguage } from "@/features/language";
import { useToast } from "@/hooks/use-toast";

export function useTicketForm({ onClose }: { onClose: () => void }) {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadTicketFile, uploading: fileUploading } = useTicketStorage();
  const { addTicket, loading: ticketLoading, error } = useUserTickets(user?.id);
  const [file, setFile] = useState<File | null>(null);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: "",
      price: "",
      quantity: "1",
      pricePerUnit: "",
      description: "",
      category: "",
      venue: "",
      eventTime: ""
    },
  });
  
  // Calculate total price when price per unit or quantity changes
  useEffect(() => {
    const pricePerUnit = Number(form.watch("pricePerUnit"));
    const quantity = Number(form.watch("quantity") || "1");
    
    if (pricePerUnit > 0 && quantity > 0) {
      const totalPrice = (pricePerUnit * quantity).toFixed(2);
      form.setValue("price", totalPrice);
    }
  }, [form.watch("pricePerUnit"), form.watch("quantity")]);
  
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
      console.log("Current user:", user);
      
      let filePath = null;
      
      // Upload file if provided
      if (file) {
        console.log("Uploading file:", file.name);
        const uploadResult = await uploadTicketFile(file);
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
      let formattedEventDate = null;
      if (values.eventDate) {
        // Handle the eventDate safely whether it's a Date or string
        formattedEventDate = values.eventDate;
      }
      
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
        quantity: Number(values.quantity || "1"),
        price_per_unit: Number(values.pricePerUnit || "0"),
        event_time: values.eventTime || null
      });
      
      console.log("Add ticket result:", result);
      
      if (!result.success) {
        toast({
          title: t("Kļūda", "Error"),
          description: result.error || t("Kļūda pievienojot biļeti", "Error adding ticket"),
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: t("Veiksmīgi!", "Success!"),
        description: t("Biļete ir pievienota", "Ticket has been added"),
      });
      
      // Reset the form
      form.reset();
      setFile(null);
      
      // Close the form
      onClose();
      
    } catch (err: any) {
      console.error("Error adding ticket:", err);
      toast({
        title: t("Kļūda", "Error"),
        description: err.message || t("Kļūda pievienojot biļeti", "Error adding ticket"),
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
    t,
    error
  };
}
