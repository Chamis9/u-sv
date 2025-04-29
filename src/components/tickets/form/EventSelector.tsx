
import React from "react";
import { useEvents } from "@/hooks/useEvents";
import { useLanguage } from "@/features/language";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TicketFormValues } from "./FormSchema";

interface EventSelectorProps {
  form: UseFormReturn<TicketFormValues>;
  eventId?: string;
}

export const EventSelector: React.FC<EventSelectorProps> = ({ form, eventId }) => {
  const { currentLanguage } = useLanguage();
  const { data: allEvents, isLoading: eventsLoading } = useEvents();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  // Don't render anything if eventId is provided
  if (eventId) return null;
  
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
