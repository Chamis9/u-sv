
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CategorySelector } from "../CategorySelector";
import { TicketFormValues } from "../schema";
import { useLanguage } from "@/features/language";

interface CategoryFieldProps {
  form: UseFormReturn<TicketFormValues>;
  t: (lv: string, en: string) => string;
}

export function CategoryField({ form, t }: CategoryFieldProps) {
  const { currentLanguage } = useLanguage();
  
  // Custom error messages based on language
  const getErrorMessage = (error: any) => {
    if (!error) return null;
    
    if (error.message === "Category is required.") {
      if (currentLanguage.code === 'lv') return "Kategorija ir obligāta.";
      if (currentLanguage.code === 'lt') return "Kategorija yra privaloma.";
      if (currentLanguage.code === 'et') return "Kategooria on kohustuslik.";
      return "Category is required.";
    }
    
    return error.message;
  };
  
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="font-medium text-gray-900 dark:text-white">
            {t("Kategorija", "Category")} <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <CategorySelector 
              value={field.value} 
              onChange={field.onChange}
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
  );
}
