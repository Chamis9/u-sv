
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/features/language";
import { AddTicketData, useTickets } from "@/hooks/tickets";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/hooks/useEvents";

interface AddTicketFormProps {
  eventId?: string;
  onSuccess?: () => void;
}

const formSchema = z.object({
  event_id: z.string().min(1, "Event selection is required"),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, "Price must be positive")
  ),
  seat_info: z.string().optional(),
  description: z.string().optional(),
  ticketFile: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.size < 5 * 1024 * 1024; // 5MB limit
    }, "File must be less than 5MB"),
});

export function AddTicketForm({ eventId, onSuccess }: AddTicketFormProps) {
  const { currentLanguage } = useLanguage();
  const { addTicket } = useTickets(eventId);
  const { user } = useAuth();
  const [ticketFileName, setTicketFileName] = useState<string>("");
  const { data: allEvents, isLoading: eventsLoading } = useEvents();

  // Translate helper
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

  const renderEventSelector = () => {
    if (eventId) return null; // Don't show event selector if eventId is provided
    
    return (
      <FormField
        control={form.control}
        name="event_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Pasākums", "Event")}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={eventsLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("Izvēlies pasākumu", "Select an event")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {allEvents?.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              {t("Izvēlies pasākumu, kuram vēlies pievienot biļeti", "Choose the event for which you want to add a ticket")}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
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
            {renderEventSelector()}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Cena (EUR)", "Price (EUR)")}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      {...field}
                      value={field.value || ''}
                      onChange={e => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("Norādiet biļetes cenu eiro", "Enter the ticket price in euros")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seat_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Sēdvietas informācija", "Seat information")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Piemēram: Rinda 5, sēdvieta 12", "Example: Row 5, seat 12")} {...field} />
                  </FormControl>
                  <FormDescription>
                    {t("Norādiet sēdvietas atrašanās vietu, ja zināms", "Specify seat location if known")}
                  </FormDescription>
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
                      placeholder={t("Papildus informācija par biļeti", "Additional information about the ticket")}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ticketFile"
              render={() => (
                <FormItem>
                  <FormLabel>{t("Biļetes fails", "Ticket file")}</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <label htmlFor="ticket-file-upload" className="cursor-pointer">
                        <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md flex items-center space-x-2 hover:bg-secondary/80">
                          <Upload className="h-4 w-4" />
                          <span>{t("Augšupielādēt failu", "Upload file")}</span>
                        </div>
                        <input
                          type="file"
                          id="ticket-file-upload"
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={onTicketFileChange}
                        />
                      </label>
                      {ticketFileName && (
                        <span className="text-sm text-muted-foreground">
                          {ticketFileName}
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t("Pievienojiet biļetes failu (redzams tikai jums)", "Upload ticket file (visible only to you)")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
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
