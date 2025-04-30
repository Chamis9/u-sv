
import React, { useEffect } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TicketFormValues } from "../schema";

interface TotalPriceFieldProps {
  form: UseFormReturn<TicketFormValues>;
  t: (lv: string, en: string) => string;
}

export function TotalPriceField({ form, t }: TotalPriceFieldProps) {
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
          <FormLabel>{t("Kopējā summa", "Total price")}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="text"
              disabled
              className="bg-gray-100"
              placeholder="0.00"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
