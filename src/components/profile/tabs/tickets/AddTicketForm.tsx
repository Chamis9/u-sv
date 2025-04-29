
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
import { useTickets } from "@/hooks/tickets";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface AddTicketFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, "Nosaukums ir pārāk īss"),
  category_id: z.string().min(1, "Jāizvēlas kategorija"),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, "Cenai jābūt pozitīvai")
  ),
  quantity: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, "Jānorāda vismaz viena biļete").max(100, "Pārāk daudz biļešu")
  ),
  description: z.string().optional(),
});

export function AddTicketForm({ onSuccess, onCancel }: AddTicketFormProps) {
  const { currentLanguage } = useLanguage();
  const { addTicket } = useTickets();
  const { user } = useAuth();
  const { data: categories } = useCategories();
  const [ticketFile, setTicketFile] = useState<File | null>(null);
  const [ticketImage, setTicketImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Translate helper
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category_id: "",
      price: undefined,
      quantity: 1,
      description: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'ticket') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (type === 'image') {
      setTicketImage(file);
    } else {
      setTicketFile(file);
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    try {
      const { error } = await supabase.storage
        .from('tickets')
        .upload(filePath, file);

      if (error) throw error;
      return filePath;
    } catch (error: any) {
      console.error("Error uploading file:", error);
      throw new Error(t("Kļūda augšupielādējot failu: ", "Error uploading file: ") + error.message);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error(t("Lai pievienotu biļeti, jums jāpierakstās", "You need to be logged in to add tickets"));
      return;
    }

    setIsUploading(true);
    try {
      let imagePath = null;
      let filePath = null;

      // Upload image if provided
      if (ticketImage) {
        imagePath = await uploadFile(ticketImage, `images/${user.id}`);
      }

      // Upload ticket file if provided
      if (ticketFile) {
        filePath = await uploadFile(ticketFile, `files/${user.id}`);
      }

      // Create the ticket data
      const eventId = await createTemporaryEvent(values.title, values.category_id, values.description || "");

      if (!eventId) {
        throw new Error(t("Neizdevās izveidot pasākumu", "Failed to create event"));
      }

      // Add the ticket
      await addTicket.mutateAsync({
        event_id: eventId,
        price: values.price,
        quantity: values.quantity,
        description: values.description,
        file_path: filePath,
        image_path: imagePath,
      });

      toast.success(t("Biļete veiksmīgi pievienota", "Ticket added successfully"));
      form.reset();
      setTicketFile(null);
      setTicketImage(null);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error adding ticket:", error);
      toast.error(error.message || t("Kļūda pievienojot biļeti", "Error adding ticket"));
    } finally {
      setIsUploading(false);
    }
  };

  // Helper function to create a temporary event
  const createTemporaryEvent = async (title: string, categoryId: string, description: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title,
          category_id: categoryId,
          description,
          created_by: user.id,
          start_date: new Date().toISOString(),
          status: 'temp_listing' // Special status for tickets added by users
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error("Error creating temporary event:", error);
      return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Pievienot biļeti", "Add ticket")}</CardTitle>
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
                    <Input 
                      placeholder={t("Piemēram: Positivus 2025", "Example: Positivus 2025")} 
                      {...field} 
                    />
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
                  <FormLabel>{t("Pasākuma veids", "Event type")}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Izvēlēties kategoriju", "Select category")} />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Cena (EUR)", "Price (EUR)")}</FormLabel>
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
                        type="number" 
                        min="1"
                        max="100"
                        {...field}
                        value={field.value || ''}
                        onChange={e => field.onChange(e.target.value)}
                      />
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
                      placeholder={t("Papildus informācija par biļeti", "Additional information about the ticket")}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <div className="space-y-2">
              <FormLabel>{t("Pasākuma attēls", "Event image")}</FormLabel>
              <div className="flex items-center space-x-2">
                <label htmlFor="ticket-image-upload" className="cursor-pointer">
                  <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md flex items-center space-x-2 hover:bg-secondary/80">
                    <Upload className="h-4 w-4" />
                    <span>{t("Augšupielādēt attēlu", "Upload image")}</span>
                  </div>
                  <input
                    type="file"
                    id="ticket-image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'image')}
                  />
                </label>
                {ticketImage && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {ticketImage.name}
                    </span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setTicketImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Ticket File Upload */}
            <div className="space-y-2">
              <FormLabel>{t("Biļetes fails", "Ticket file")}</FormLabel>
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
                    onChange={(e) => handleFileChange(e, 'ticket')}
                  />
                </label>
                {ticketFile && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {ticketFile.name}
                    </span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setTicketFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <FormDescription>
                {t("Pievienojiet biļetes failu (PDF vai attēls)", "Upload ticket file (PDF or image)")}
              </FormDescription>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              {onCancel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                >
                  {t("Atcelt", "Cancel")}
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isUploading || addTicket.isPending}
              >
                {isUploading || addTicket.isPending 
                  ? t("Pievieno...", "Adding...") 
                  : t("Pievienot biļeti", "Add ticket")
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
