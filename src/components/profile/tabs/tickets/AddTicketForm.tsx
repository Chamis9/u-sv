
import React, { useState } from "react";
import { useLanguage } from "@/features/language";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTicketStorage } from "@/hooks/tickets";
import { useUserTickets } from "@/hooks/tickets";
import { useAuth } from "@/contexts/AuthContext";
import { LoaderCircle, CalendarIcon } from "lucide-react";
import { TicketFileUpload } from "./TicketFileUpload";
import { CategorySelector } from "./CategorySelector";
import { ticketFormSchema, TicketFormValues } from "./schema";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AddTicketFormProps {
  onClose: () => void;
}

export function AddTicketForm({ onClose }: AddTicketFormProps) {
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
      category: "other"
    },
  });
  
  const onSubmit = async (values: TicketFormValues) => {
    if (!user) {
      return;
    }
    
    try {
      console.log("Submitting form with values:", values);
      
      // First upload the file if provided
      let filePath = null;
      let fileUrl = null;
      
      if (file) {
        console.log("Uploading file:", file.name);
        const uploadResult = await uploadTicketFile(file, user.id);
        if (uploadResult) {
          filePath = uploadResult.path;
          fileUrl = uploadResult.url;
          console.log("File uploaded successfully:", filePath);
        }
      }
      
      // Find category id using CategoryService
      const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('name', values.category)
        .maybeSingle();
      
      // Format event date if provided
      const formattedEventDate = values.eventDate ? values.eventDate.toISOString().split('T')[0] : null;
      
      // Then create the ticket entry
      addTicket({
        title: values.title,
        description: values.description,
        price: Number(values.price),
        user_id: user.id,
        file_path: filePath,
        category_name: values.category,
        category_id: categories?.id,
        event_id: null, // Required property for AddTicketData
        event_date: formattedEventDate
      });
      
      console.log("Ticket added successfully");
      
      // Close the form
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
  
  const isLoading = fileUploading || ticketLoading;
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Nosaukums", "Title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Biļetes nosaukums", "Ticket title")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Cena (€)", "Price (€)")}</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CategorySelector form={form} />
        
        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("Pasākuma datums", "Event date")}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd.MM.yyyy")
                      ) : (
                        <span>{t("Izvēlies datumu", "Pick a date")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Apraksts", "Description")}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t("Biļetes apraksts (piem., sēdvieta)", "Ticket description (e.g., seat)")}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <TicketFileUpload file={file} onFileChange={setFile} />
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("Atcelt", "Cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            {t("Pievienot biļeti", "Add Ticket")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
