
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CategorySelector } from "../CategorySelector";
import { TicketFormValues } from "../schema";
import { useLanguage } from "@/features/language";

interface CategoryFieldProps {
  form: UseFormReturn<TicketFormValues>;
}

export function CategoryField({ form }: CategoryFieldProps) {
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
    
    if (error.message === "Category is required.") {
      return t(
        "Kategorija ir obligāta.", 
        "Category is required.",
        "Kategorija yra privaloma.",
        "Kategooria on kohustuslik."
      );
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
            {t("Kategorija", "Category", "Kategorija", "Kategooria")} <span className="text-red-500">*</span>
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
