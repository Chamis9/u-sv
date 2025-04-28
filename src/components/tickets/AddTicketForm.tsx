
import React, { useState } from "react";
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
import { useLanguage } from "@/features/language";
import { AddTicketData, useTickets } from "@/hooks/useTickets";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AddTicketFormProps {
  eventId: string;
  onSuccess?: () => void;
}

const formSchema = z.object({
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

  // Translate helper
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: undefined,
      seat_info: "",
      description: "",
    },
  });

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
      filePath = `tickets/${user.id}/${eventId}/${fileName}`;

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
      event_id: eventId,
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
    <Card>
      <CardHeader>
        <CardTitle>{t("Pievienot biļeti", "Add ticket")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
