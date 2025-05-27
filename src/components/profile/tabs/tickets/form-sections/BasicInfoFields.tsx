
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TicketFormValues } from "../schema";
import { useLanguage } from "@/features/language";

interface BasicInfoFieldsProps {
  form: UseFormReturn<TicketFormValues>;
}

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
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

  // Custom error messages based on language
  const getErrorMessage = (error: any) => {
    if (!error) return null;
    
    if (error.message === "Title is required.") {
      return t(
        "Nosaukums ir obligāts.",
        "Title is required.",
        "Pavadinimas yra privalomas.",
        "Pealkiri on kohustuslik."
      );
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
              {t("Nosaukums", "Title", "Pavadinimas", "Pealkiri")} <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder={t("Ievadiet biļetes nosaukumu", "Enter ticket title", "Įveskite bilieto pavadinimą", "Sisestage pileti pealkiri")}
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
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-900 dark:text-white">
              {t("Apraksts", "Description", "Aprašymas", "Kirjeldus")}
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder={t("Ievadiet biļetes aprakstu", "Enter ticket description", "Įveskite bilieto aprašymą", "Sisestage pileti kirjeldus")}
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
