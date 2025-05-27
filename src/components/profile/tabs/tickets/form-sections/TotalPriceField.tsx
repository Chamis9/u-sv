
import React, { useEffect } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TicketFormValues } from "../schema";
import { useLanguage } from "@/features/language";

interface TotalPriceFieldProps {
  form: UseFormReturn<TicketFormValues>;
}

export function TotalPriceField({ form }: TotalPriceFieldProps) {
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
  
  // Watch the price per unit and quantity fields to calculate total price
  const pricePerUnit = useWatch({
    control: form.control,
    name: "pricePerUnit",
    defaultValue: "0"
  });
  
  const quantity = useWatch({
    control: form.control,
    name: "quantity",
    defaultValue: "1"
  });

  // Calculate total price whenever pricePerUnit or quantity changes
  useEffect(() => {
    const pricePerUnitNum = Number(pricePerUnit) || 0;
    const quantityNum = Number(quantity) || 1;
    
    if (!isNaN(pricePerUnitNum) && !isNaN(quantityNum)) {
      const totalPrice = (pricePerUnitNum * quantityNum).toFixed(2);
      form.setValue("price", totalPrice);
    }
  }, [pricePerUnit, quantity, form]);

  return (
    <FormField
      control={form.control}
      name="price"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-medium text-gray-900 dark:text-white">
            {t("Kopējā summa", "Total price", "Bendra suma", "Kogusumma")}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type="text"
              disabled
              className="bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-200 font-medium"
              placeholder="0.00"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
