
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TicketFormValues } from "../schema";

interface BasicInfoFieldsProps {
  form: UseFormReturn<TicketFormValues>;
  t: (lv: string, en: string) => string;
}

export function BasicInfoFields({ form, t }: BasicInfoFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Nosaukums", "Title")}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t("Ievadiet nosaukumu", "Enter title")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Apraksts", "Description")}</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder={t("Ievadiet biļetes aprakstu", "Enter ticket description")} 
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
