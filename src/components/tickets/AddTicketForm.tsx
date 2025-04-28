
import React from "react";
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
});

export function AddTicketForm({ eventId, onSuccess }: AddTicketFormProps) {
  const { currentLanguage } = useLanguage();
  const { addTicket } = useTickets(eventId);

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const ticketData: AddTicketData = {
      event_id: eventId,
      price: values.price!,
      seat_info: values.seat_info,
      description: values.description,
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
