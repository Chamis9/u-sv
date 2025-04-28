
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/features/language";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoginDialog } from "@/components/auth/LoginDialog";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  start_date: z.date({
    required_error: "Event date is required",
  }),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0.01, "Price must be greater than 0")
  ),
  ticketFile: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.size < 5 * 1024 * 1024; // 5MB limit
    }, "File must be less than 5MB"),
  eventImage: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.size < 3 * 1024 * 1024; // 3MB limit
    }, "Image must be less than 3MB")
});

export function AddEventForm() {
  const { currentLanguage } = useLanguage();
  const { data: categories } = useCategories();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [ticketFileName, setTicketFileName] = useState<string>("");
  const [eventImageName, setEventImageName] = useState<string>("");

  // Translate helper
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      category_id: "",
    },
  });

  const onTicketFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("ticketFile", file);
      setTicketFileName(file.name);
    }
  };

  const onEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("eventImage", file);
      setEventImageName(file.name);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload event image if present
      let image_url = null;
      if (values.eventImage) {
        const fileExt = values.eventImage.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `events/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('event_images')
          .upload(filePath, values.eventImage);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        // Get the public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('event_images')
          .getPublicUrl(filePath);
        
        image_url = publicUrl;
      }

      // Create the event in the database
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert({
          title: values.title,
          description: values.description || null,
          category_id: values.category_id,
          start_date: values.start_date.toISOString(),
          image_url: image_url,
          created_by: user?.id,
        })
        .select()
        .single();

      if (eventError) {
        throw new Error(eventError.message);
      }

      // Upload ticket file if present
      if (values.ticketFile && eventData) {
        const fileExt = values.ticketFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `tickets/${user?.id}/${eventData.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('ticket_files')
          .upload(filePath, values.ticketFile);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        // Create ticket record
        const { error: ticketError } = await supabase
          .from('tickets')
          .insert({
            event_id: eventData.id,
            user_id: user?.id,
            price: values.price,
            file_path: filePath,
          });

        if (ticketError) {
          throw new Error(ticketError.message);
        }
      }

      toast.success(t("Pasākums un biļete veiksmīgi pievienoti!", "Event and ticket successfully added!"));
      navigate(`/events/${values.category_id}/${eventData.id}`);
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error(t("Kļūda pievienojot pasākumu", "Error adding event"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Pievienot pasākumu un biļeti", "Add event and ticket")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Pasākuma nosaukums", "Event title")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Ievadiet pasākuma nosaukumu", "Enter event title")} {...field} />
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
                    <Textarea placeholder={t("Pasākuma apraksts", "Event description")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Kategorija", "Category")}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Izvēlieties kategoriju", "Select category")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("Pasākuma datums un laiks", "Event date and time")}</FormLabel>
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
                            format(field.value, "PPP HH:mm")
                          ) : (
                            <span>{t("Izvēlieties datumu", "Pick a date")}</span>
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
                        className={cn("p-3 pointer-events-auto")}
                      />
                      {field.value && (
                        <div className="p-3 border-t border-border">
                          <Input
                            type="time"
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = new Date(field.value);
                              newDate.setHours(parseInt(hours, 10));
                              newDate.setMinutes(parseInt(minutes, 10));
                              field.onChange(newDate);
                            }}
                            defaultValue={field.value ? 
                              `${field.value.getHours().toString().padStart(2, '0')}:${field.value.getMinutes().toString().padStart(2, '0')}` : 
                              "00:00"
                            }
                          />
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Biļetes cena (EUR)", "Ticket price (EUR)")}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      {...field}
                      value={field.value || ''}
                      onChange={e => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("Norādiet biļetes cenu eiro", "Enter the ticket price in euros")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="eventImage"
              render={() => (
                <FormItem>
                  <FormLabel>{t("Pasākuma attēls", "Event image")}</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <label htmlFor="event-image" className="cursor-pointer">
                        <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md flex items-center space-x-2 hover:bg-secondary/80">
                          <Upload className="h-4 w-4" />
                          <span>{t("Augšupielādēt attēlu", "Upload image")}</span>
                        </div>
                        <input
                          type="file"
                          id="event-image"
                          className="hidden"
                          accept="image/*"
                          onChange={onEventImageChange}
                        />
                      </label>
                      {eventImageName && (
                        <span className="text-sm text-muted-foreground">
                          {eventImageName}
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t("Pievienojiet pasākuma attēlu (neobligāti)", "Add an event image (optional)")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ticketFile"
              render={() => (
                <FormItem>
                  <FormLabel>{t("Biļetes fails", "Ticket file")}</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <label htmlFor="ticket-file" className="cursor-pointer">
                        <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md flex items-center space-x-2 hover:bg-secondary/80">
                          <Upload className="h-4 w-4" />
                          <span>{t("Augšupielādēt failu", "Upload file")}</span>
                        </div>
                        <input
                          type="file"
                          id="ticket-file"
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
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting 
                ? t("Pievieno...", "Adding...") 
                : t("Pievienot pasākumu un biļeti", "Add event and ticket")
              }
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
