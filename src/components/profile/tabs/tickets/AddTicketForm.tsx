
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, CalendarIcon, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TicketFileUpload } from "./TicketFileUpload";
import { CategorySelector } from "./CategorySelector";
import { useTicketForm } from "./hooks/useTicketForm";

interface AddTicketFormProps {
  onClose: () => void;
}

export function AddTicketForm({ onClose }: AddTicketFormProps) {
  const {
    form,
    file,
    setFile,
    isLoading,
    handleSubmit,
    t
  } = useTicketForm({ onClose });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Nosaukums", "Title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Pasākuma nosaukums", "Event title")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pricePerUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Cena par vienību (€)", "Price Per Unit (€)")}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
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
                <FormLabel>{t("Daudzums", "Quantity")}</FormLabel>
                <FormControl>
                  <Input type="number" step="1" min="1" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Kopējā cena (€)", "Total Price (€)")}</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder={t("Aprēķināsies automātiski", "Will be calculated automatically")} 
                  {...field} 
                  readOnly 
                  className="bg-gray-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CategorySelector form={form} />
        
        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Norises vieta", "Venue")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-10" placeholder={t("Pasākuma norises vieta", "Event venue")} {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("Pasākuma datums", "Event date")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd.MM.yyyy")
                        ) : (
                          <span>{t("Izvēlies datumu", "Pick a date")}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="eventTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Pasākuma laiks", "Event time")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="time"
                      className="pl-10"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Apraksts", "Description")}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t("Biļetes apraksts (piem., sēdvieta)", "Ticket description (e.g., seat)")}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <TicketFileUpload file={file} onFileChange={setFile} />
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("Atcelt", "Cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            {t("Pievienot biļeti", "Add Ticket")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
