
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TicketFormValues } from "../schema";
import { useLanguage } from "@/features/language";

interface EventDetailsFieldsProps {
  form: UseFormReturn<TicketFormValues>;
  t: (lv: string, en: string) => string;
}

export function EventDetailsFields({ form, t }: EventDetailsFieldsProps) {
  const { currentLanguage } = useLanguage();
  
  // Custom error messages based on language
  const getErrorMessage = (error: any) => {
    if (!error) return null;
    
    if (error.message === "Venue is required.") {
      return currentLanguage.code === 'lv' 
        ? "Norises vieta ir obligāta." 
        : "Venue is required.";
    }
    
    if (error.message === "Event date is required.") {
      return currentLanguage.code === 'lv' 
        ? "Datums ir obligāts." 
        : "Event date is required.";
    }
    
    return error.message;
  };
  
  return (
    <>
      <FormField
        control={form.control}
        name="venue"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-900 dark:text-white">
              {t("Norises vieta", "Venue")} <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder={t("Ievadiet norises vietu", "Enter venue")}
                className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" 
              />
            </FormControl>
            {fieldState.error && (
              <FormMessage>
                {getErrorMessage(fieldState.error)}
              </FormMessage>
            )}
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="eventDate"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="font-medium text-gray-900 dark:text-white">
                {t("Pasākuma datums", "Event date")} <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="date"
                  required
                  className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </FormControl>
              {fieldState.error && (
                <FormMessage>
                  {getErrorMessage(fieldState.error)}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="eventTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-gray-900 dark:text-white">
                {t("Pasākuma laiks", "Event time")}
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
