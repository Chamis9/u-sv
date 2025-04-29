
import React from "react";
import { useLanguage } from "@/features/language";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TicketFormValues } from "./FormSchema";

interface PriceFieldProps {
  form: UseFormReturn<TicketFormValues>;
}

export const PriceField: React.FC<PriceFieldProps> = ({ form }) => {
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  return (
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
  );
};
