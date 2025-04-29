
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useLanguage } from "@/features/language";
import { AddTicketData, useTickets } from "@/hooks/tickets";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ticketFormSchema, TicketFormValues } from "./FormSchema";
import { EventSelector } from "./EventSelector";
import { PriceField } from "./PriceField";
import { SeatInfoField } from "./SeatInfoField";
import { DescriptionField } from "./DescriptionField";
import { TicketFileField } from "./TicketFileField";

interface AddTicketFormProps {
  eventId?: string;
  onSuccess?: () => void;
}

export function AddTicketForm({ eventId, onSuccess }: AddTicketFormProps) {
  const { currentLanguage } = useLanguage();
  const { addTicket } = useTickets(eventId);
  const { user } = useAuth();
  const [ticketFileName, setTicketFileName] = useState<string>("");
  
  // Translate helper
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      event_id: eventId || "",
      price: undefined,
      seat_info: "",
      description: "",
    },
  });

  // Set the event_id if provided as prop
  useEffect(() => {
    if (eventId) {
      form.setValue("event_id", eventId);
    }
  }, [eventId, form]);

  const onTicketFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("ticketFile", file);
      setTicketFileName(file.name);
    }
  };

  const onSubmit = async (values: TicketFormValues) => {
    // First handle file upload if present
    let filePath: string | undefined = undefined;
    
    if (values.ticketFile && user) {
      const fileExt = values.ticketFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      filePath = `tickets/${user.id}/${values.event_id}/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('ticket_files')
          .upload(filePath, values.ticketFile);

        if (uploadError) {
          console.error("Error uploading ticket file:", uploadError);
          // Continue without file if upload fails
          filePath = undefined;
        }
      } catch (error) {
        console.error("Exception uploading ticket file:", error);
        // Continue without file if upload fails
        filePath = undefined;
      }
    }

    const ticketData: AddTicketData = {
      event_id: values.event_id,
      price: values.price!,
      seat_info: values.seat_info,
      description: values.description,
      file_path: filePath,
    };

    await addTicket.mutateAsync(ticketData);
    form.reset();
    if (onSuccess) onSuccess();
  };

  return (
    <Card className={eventId ? "" : "w-full"}>
      {!eventId && (
        <CardHeader>
          <CardTitle>{t("Pievienot biļeti", "Add ticket")}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EventSelector form={form} eventId={eventId} />
            <PriceField form={form} />
            <SeatInfoField form={form} />
            <DescriptionField form={form} />
            <TicketFileField 
              form={form} 
              ticketFileName={ticketFileName} 
              onTicketFileChange={onTicketFileChange} 
            />
            <Button 
              type="submit" 
              disabled={addTicket.isPending}
              className="w-full"
            >
              {addTicket.isPending 
                ? t("Pievieno...", "Adding...") 
                : t("Pievienot biļeti", "Add ticket")
              }
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
