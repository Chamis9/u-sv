
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/features/language";

interface PriceFieldProps {
  form: any;
}

export const PriceField = ({ form }: PriceFieldProps) => {
  const { currentLanguage } = useLanguage();
  
  // Translate helper
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  return (
    <FormField
      control={form.control}
      name="price"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("Biļetes cena (EUR)", "Ticket price (EUR)")}</FormLabel>
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
