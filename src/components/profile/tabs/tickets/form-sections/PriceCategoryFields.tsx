
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CategorySelector } from "../CategorySelector";
import { TicketFormValues } from "../schema";

interface PriceCategoryFieldsProps {
  form: UseFormReturn<TicketFormValues>;
  t: (lv: string, en: string) => string;
}

export function PriceCategoryFields({ form, t }: PriceCategoryFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Cena", "Price")}</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="number"
                min="0" 
                step="0.01" 
                placeholder="0.00" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Kategorija", "Category")}</FormLabel>
            <FormControl>
              <CategorySelector 
                value={field.value} 
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
