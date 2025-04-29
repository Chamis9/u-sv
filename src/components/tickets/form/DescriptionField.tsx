
import React from "react";
import { useLanguage } from "@/features/language";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { TicketFormValues } from "./FormSchema";

interface DescriptionFieldProps {
  form: UseFormReturn<TicketFormValues>;
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({ form }) => {
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  return (
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
  );
};
