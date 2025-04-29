
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

interface SeatInfoFieldProps {
  form: UseFormReturn<TicketFormValues>;
}

export const SeatInfoField: React.FC<SeatInfoFieldProps> = ({ form }) => {
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  return (
    <FormField
      control={form.control}
      name="seat_info"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("Sēdvietas informācija", "Seat information")}</FormLabel>
          <FormControl>
            <Input placeholder={t("Piemēram: Rinda 5, sēdvieta 12", "Example: Row 5, seat 12")} {...field} />
          </FormControl>
          <FormDescription>
            {t("Norādiet sēdvietas atrašanās vietu, ja zināms", "Specify seat location if known")}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
