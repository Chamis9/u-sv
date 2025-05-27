
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TicketFormValues } from "../schema";
import { useLanguage } from "@/features/language";

interface EventDetailsFieldsProps {
  form: UseFormReturn<TicketFormValues>;
}

export function EventDetailsFields({ form }: EventDetailsFieldsProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string, ltText: string, eeText: string) => {
    switch (currentLanguage.code) {
      case 'lv': return lvText;
      case 'en': return enText;
      case 'lt': return ltText;
      case 'et':
      case 'ee': return eeText;
      default: return lvText;
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="venue"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-900 dark:text-white">
              {t("Norises vieta", "Venue", "Vieta", "Toimumiskoht")}
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder={t("Ievadiet pasākuma vietu", "Enter event venue", "Įveskite renginio vietą", "Sisestage ürituse koht")}
                className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
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
              <FormLabel className="font-medium text-gray-900 dark:text-white">
                {t("Pasākuma datums", "Event date", "Renginio data", "Ürituse kuupäev")}
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="date"
                  className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
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
              <FormLabel className="font-medium text-gray-900 dark:text-white">
                {t("Pasākuma laiks", "Event time", "Renginio laikas", "Ürituse kellaaeg")}
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="time"
                  className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
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
