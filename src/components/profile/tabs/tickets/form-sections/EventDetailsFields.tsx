
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TicketFormValues } from "../schema";

interface EventDetailsFieldsProps {
  form: UseFormReturn<TicketFormValues>;
  t: (lv: string, en: string) => string;
}

export function EventDetailsFields({ form, t }: EventDetailsFieldsProps) {
  return (
    <>
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
                  inputMode="numeric"
                  pattern="[0-9]{2}:[0-9]{2}"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
