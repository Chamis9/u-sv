
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CategorySelector } from "../CategorySelector";
import { TicketFormValues } from "../schema";

interface CategoryFieldProps {
  form: UseFormReturn<TicketFormValues>;
  t: (lv: string, en: string) => string;
}

export function CategoryField({ form, t }: CategoryFieldProps) {
  return (
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
  );
}
