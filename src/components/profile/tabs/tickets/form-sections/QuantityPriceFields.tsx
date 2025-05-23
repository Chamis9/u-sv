
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TicketFormValues } from "../schema";
import { TotalPriceField } from "./TotalPriceField";
import { useLanguage } from "@/features/language";

interface QuantityPriceFieldsProps {
  form: UseFormReturn<TicketFormValues>;
  t: (lv: string, en: string) => string;
}

export function QuantityPriceFields({ form, t }: QuantityPriceFieldsProps) {
  const { currentLanguage } = useLanguage();
  
  // Custom error messages based on language
  const getErrorMessage = (error: any) => {
    if (!error) return null;
    
    if (error.message === "Price per unit must be a valid number greater than 0") {
      return currentLanguage.code === 'lv' 
        ? "Cenai par biļeti jābūt lielākai par 0" 
        : "Price per unit must be a valid number greater than 0";
    }
    
    if (error.message === "Quantity must be a valid number greater than 0") {
      return currentLanguage.code === 'lv' 
        ? "Biļešu skaitam jābūt lielākam par 0" 
        : "Quantity must be a valid number greater than 0";
    }
    
    return error.message;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="pricePerUnit"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="font-medium text-gray-900 dark:text-white">
                {t("Cena par biļeti", "Price per ticket")} <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number"
                  min="0.01" 
                  step="0.01" 
                  placeholder="0.00" 
                  required
                  className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
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
        
        <FormField
          control={form.control}
          name="quantity"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="font-medium text-gray-900 dark:text-white">
                {t("Biļešu skaits", "Ticket quantity")} <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number"
                  min="1" 
                  step="1" 
                  placeholder="1" 
                  required
                  className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
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
      </div>
      
      <TotalPriceField form={form} t={t} />
    </>
  );
}
