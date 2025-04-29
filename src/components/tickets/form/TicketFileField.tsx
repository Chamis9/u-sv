
import React from "react";
import { Upload } from "lucide-react";
import { useLanguage } from "@/features/language";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { TicketFormValues } from "./FormSchema";

interface TicketFileFieldProps {
  form: UseFormReturn<TicketFormValues>;
  ticketFileName: string;
  onTicketFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TicketFileField: React.FC<TicketFileFieldProps> = ({ 
  form, 
  ticketFileName, 
  onTicketFileChange 
}) => {
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  return (
    <FormField
      control={form.control}
      name="ticketFile"
      render={() => (
        <FormItem>
          <FormLabel>{t("Biļetes fails", "Ticket file")}</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              <label htmlFor="ticket-file-upload" className="cursor-pointer">
                <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md flex items-center space-x-2 hover:bg-secondary/80">
                  <Upload className="h-4 w-4" />
                  <span>{t("Augšupielādēt failu", "Upload file")}</span>
                </div>
                <input
                  type="file"
                  id="ticket-file-upload"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={onTicketFileChange}
                />
              </label>
              {ticketFileName && (
                <span className="text-sm text-muted-foreground">
                  {ticketFileName}
                </span>
              )}
            </div>
          </FormControl>
          <FormDescription>
            {t("Pievienojiet biļetes failu (redzams tikai jums)", "Upload ticket file (visible only to you)")}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
