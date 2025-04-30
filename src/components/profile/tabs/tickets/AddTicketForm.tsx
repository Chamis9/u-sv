
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketFormSchema, TicketFormValues } from "./schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { useUserTickets, UserTicket, AddTicketData } from "@/hooks/tickets";
import { TicketFileUpload } from "./TicketFileUpload";
import { useAddTicketForm } from "./hooks/useAddTicketForm";
import {
  BasicInfoFields,
  CategoryField,
  EventDetailsFields,
  QuantityPriceFields,
  FormActions
} from "./form-sections";

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
  
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: isEditing && ticketToEdit ? {
      title: ticketToEdit.title,
      description: ticketToEdit.description || "",
      category: ticketToEdit.category,
      venue: ticketToEdit.venue || "",
      eventDate: ticketToEdit.event_date || "",
      eventTime: ticketToEdit.event_time || "",
      quantity: ticketToEdit.quantity?.toString() || "1",
      pricePerUnit: ticketToEdit.price_per_unit?.toString() || "",
      price: ticketToEdit.price?.toString() || "0",
    } : {
      title: "",
      description: "",
      category: "",
      venue: "",
      eventDate: "",
      eventTime: "",
      quantity: "1",
      pricePerUnit: "",
      price: "0",
    },
  });
  
  const { submitting, onSubmit, t } = useAddTicketForm({
    form,
    userId: user?.id,
    onClose,
    isEditing,
    ticketToEdit,
    addTicket,
    updateTicket: onUpdate,
    uploadTicketFile
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Field order as requested */}
        <BasicInfoFields form={form} t={t} />
        <CategoryField form={form} t={t} />
        <EventDetailsFields form={form} t={t} />
        <QuantityPriceFields form={form} t={t} />

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
        
        <FormActions 
          onClose={onClose}
          isEditing={isEditing}
          submitting={submitting}
          t={t}
        />
      </form>
    </Form>
  );
}
