
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TicketFormValues } from "../schema";
import { useLanguage } from "@/features/language";

interface BasicInfoFieldsProps {
  form: UseFormReturn<TicketFormValues>;
  t: (lv: string, en: string) => string;
}

export function BasicInfoFields({ form, t }: BasicInfoFieldsProps) {
  const { currentLanguage } = useLanguage();

  // Custom error messages based on language
  const getErrorMessage = (error: any) => {
    if (!error) return null;
    
    if (error.message === "Title must be at least 3 characters.") {
      return currentLanguage.code === 'lv' 
        ? "Nosaukumam jābūt vismaz 3 rakstzīmēm." 
        : "Title must be at least 3 characters.";
    }
    
    return error.message;
  };

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-900 dark:text-white">
              {t("Nosaukums", "Title")} <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder={t("Ievadiet nosaukumu", "Enter title")}
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
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-900 dark:text-white">
              {t("Apraksts", "Description")}
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder={t("Ievadiet biļetes aprakstu", "Enter ticket description")} 
                rows={3}
                className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
