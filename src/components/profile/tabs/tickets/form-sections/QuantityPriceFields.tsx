
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TicketFormValues } from "../schema";
import { TotalPriceField } from "./TotalPriceField";

interface QuantityPriceFieldsProps {
  form: UseFormReturn<TicketFormValues>;
  t: (lv: string, en: string) => string;
}

export function QuantityPriceFields({ form, t }: QuantityPriceFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="pricePerUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Cena par biļeti", "Price per ticket")}</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number"
                  min="0.01" 
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
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Biļešu skaits", "Ticket quantity")}</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number"
                  min="1" 
                  step="1" 
                  placeholder="1" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <TotalPriceField form={form} t={t} />
    </>
  );
}
