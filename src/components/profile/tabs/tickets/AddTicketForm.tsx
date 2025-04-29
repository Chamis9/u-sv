
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/features/language';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUserTickets } from '@/hooks/useUserTickets';
import { useTicketStorage } from '@/hooks/useTicketStorage';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useEvents } from '@/hooks/useEvents';
import { Loader2, TicketPlus } from 'lucide-react';

const formSchema = z.object({
  eventId: z.string().uuid({ message: "Please select an event" }),
  price: z.coerce.number().positive({ message: "Price must be greater than 0" }),
  description: z.string().optional(),
  file: z.instanceof(File).optional()
});

type FormValues = z.infer<typeof formSchema>;

export function AddTicketForm({ onClose }: { onClose: () => void }) {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { addTicket } = useUserTickets(user?.id);
  const { uploadTicketFile, uploading, error: uploadError } = useTicketStorage();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: events, isLoading: eventsLoading } = useEvents();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventId: '',
      price: undefined,
      description: '',
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const onSubmit = async (values: FormValues) => {
    if (!user?.id) return;
    
    setIsSubmitting(true);
    try {
      // Upload file if provided
      let filePath = null;
      if (file) {
        const fileResult = await uploadTicketFile(file, user.id);
        if (!fileResult) {
          setIsSubmitting(false);
          return; // Upload failed
        }
        filePath = fileResult.path;
      }
      
      // Add ticket to database
      addTicket({
        title: events?.find(event => event.id === values.eventId)?.title || '',
        description: values.description || null,
        event_id: values.eventId,
        price: values.price,
        user_id: user.id,
        file_path: filePath
      });
      
      onClose(); // Close dialog after submission
    } catch (error) {
      console.error("Error adding ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="eventId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Pasākums", "Event")}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={eventsLoading || isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Izvēlēties pasākumu", "Select an event")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {events?.map((event) => (
                    <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                  min="0.01"
                  placeholder="0.00" 
                  {...field} 
                  disabled={isSubmitting}
                />
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
              <FormLabel>{t("Apraksts (neobligāts)", "Description (optional)")}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t("Vietas numurs, papildus informācija par biļeti...", "Seat number, additional ticket information...")} 
                  {...field} 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormItem>
          <FormLabel>{t("Biļetes fails (neobligāts)", "Ticket file (optional)")}</FormLabel>
          <FormControl>
            <Input 
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png" 
              onChange={handleFileChange}
              disabled={uploading || isSubmitting}
            />
          </FormControl>
          {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
          <p className="text-xs text-muted-foreground">
            {t("Atbalstīti formāti: PDF, JPG, PNG", "Supported formats: PDF, JPG, PNG")}
          </p>
        </FormItem>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting || uploading}
          >
            {t("Atcelt", "Cancel")}
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || uploading}
          >
            {(isSubmitting || uploading) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Pievieno...", "Adding...")}
              </>
            ) : (
              <>
                <TicketPlus className="mr-2 h-4 w-4" />
                {t("Pievienot biļeti", "Add ticket")}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
