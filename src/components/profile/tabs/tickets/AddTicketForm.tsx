import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketFormSchema, TicketFormValues } from "./schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CategorySelector } from "./CategorySelector";
import { TicketFileUpload } from "./TicketFileUpload";
import { useLanguage } from "@/features/language";
import { useUserTickets, UserTicket, AddTicketData } from "@/hooks/tickets";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AddTicketFormProps {
  onClose: () => void;
  isEditing?: boolean;
  ticketToEdit?: UserTicket;
  onUpdate?: (ticketId: string, data: Partial<AddTicketData>) => Promise<{ success: boolean; error?: string }>;
}

export function AddTicketForm({ 
  onClose,
  isEditing = false,
  ticketToEdit,
  onUpdate
}: AddTicketFormProps) {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { addTicket, uploadTicketFile } = useUserTickets(user?.id);
  const { toast } = useToast();
  
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: isEditing && ticketToEdit ? {
      title: ticketToEdit.title,
      description: ticketToEdit.description || "",
      price: ticketToEdit.price.toString(),
      category: ticketToEdit.category,
      eventDate: ticketToEdit.event_date || "",
      venue: ticketToEdit.venue || "",
      quantity: ticketToEdit.quantity?.toString() || "1",
      pricePerUnit: ticketToEdit.price_per_unit?.toString() || ticketToEdit.price?.toString() || "0",
      eventTime: ticketToEdit.event_time || "",
    } : {
      title: "",
      description: "",
      price: "",
      category: "",
      eventDate: "",
      venue: "",
      quantity: "1",
      pricePerUnit: "",
      eventTime: "",
    },
  });
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const onSubmit = async (values: TicketFormValues) => {
    if (!user?.id) {
      toast({
        title: t("Kļūda", "Error"),
        description: t("Lai pievienotu biļeti, lūdzu pieslēdzieties", "Please log in to add a ticket"),
        variant: "destructive",
      });
      return;
    }

    try {
      let filePath = undefined;
      
      // Handle file upload if a file was selected
      if (values.file) {
        const uploadResult = await uploadTicketFile(values.file);
        if (uploadResult.error) {
          toast({
            title: t("Kļūda augšupielādējot failu", "File upload error"),
            description: uploadResult.error,
            variant: "destructive",
          });
          return;
        }
        filePath = uploadResult.path;
      }
      
      // Prepare ticket data
      const ticketData: AddTicketData = {
        title: values.title,
        description: values.description || undefined,
        price: parseFloat(values.price),
        user_id: user.id,
        category_name: values.category,
        event_date: values.eventDate || undefined,
        venue: values.venue || undefined,
        quantity: values.quantity ? parseInt(values.quantity) : 1,
        price_per_unit: values.pricePerUnit ? parseFloat(values.pricePerUnit) : parseFloat(values.price),
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
      
      if (isEditing && ticketToEdit && onUpdate) {
        // Update existing ticket
        const updateResult = await onUpdate(ticketToEdit.id, ticketData);
        success = updateResult.success;
        
        if (!success) {
          toast({
            title: t("Kļūda", "Error"),
            description: updateResult.error || t(
              "Kļūda atjauninot biļeti. Lūdzu mēģiniet vēlreiz.", 
              "Failed to update ticket. Please try again."
            ),
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: t("Biļete atjaunināta", "Ticket updated"),
          description: t(
            "Biļetes informācija ir veiksmīgi atjaunināta", 
            "Ticket information has been successfully updated"
          ),
        });
      } else {
        // Add new ticket
        const { success: addSuccess, error } = await addTicket(ticketData);
        success = addSuccess;
        
        if (!success) {
          toast({
            title: t("Kļūda", "Error"),
            description: error || t(
              "Kļūda pievienojot biļeti. Lūdzu mēģiniet vēlreiz.", 
              "Failed to add ticket. Please try again."
            ),
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: t("Biļete pievienota", "Ticket added"),
          description: t(
            "Biļete ir veiksmīgi pievienota", 
            "Ticket has been successfully added"
          ),
        });
      }
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Error handling ticket submission:", error);
      toast({
        title: t("Kļūda", "Error"),
        description: t(
          "Nezināma kļūda. Lūdzu mēģiniet vēlreiz.", 
          "Unknown error. Please try again."
        ),
        variant: "destructive",
      });
    }
  };
  
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
                <Input {...field} placeholder={t("Ievadiet nosaukumu", "Enter title")} />
              </FormControl>
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
                  {...field} 
                  placeholder={t("Ievadiet biļetes aprakstu", "Enter ticket description")} 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Cena", "Price")}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number"
                    min="0" 
                    step="0.01" 
                    placeholder="0.00" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Kategorija", "Category")}</FormLabel>
                <FormControl>
                  <CategorySelector 
                    value={field.value} 
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Pasākuma datums", "Event date")}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="eventTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Pasākuma laiks", "Event time")}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="time"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Norises vieta", "Venue")}</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder={t("Ievadiet norises vietu", "Enter venue")} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Biļešu skaits", "Ticket quantity")}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number"
                    min="1" 
                    step="1" 
                    placeholder="1" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pricePerUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Cena par biļeti", "Price per ticket")}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number"
                    min="0" 
                    step="0.01" 
                    placeholder="0.00" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!isEditing && (
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Biļetes fails", "Ticket file")}</FormLabel>
                <FormControl>
                  <TicketFileUpload onChange={(file) => field.onChange(file)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            {t("Atcelt", "Cancel")}
          </Button>
          <Button type="submit">
            {isEditing ? t("Atjaunināt", "Update") : t("Pievienot", "Add")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
