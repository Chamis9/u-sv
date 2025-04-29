
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
import { useCategories } from '@/hooks/useCategories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const customTicketFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  categoryId: z.string().uuid({ message: "Please select a category" }),
  price: z.coerce.number().positive({ message: "Price must be greater than 0" }),
  description: z.string().optional(),
  quantity: z.coerce.number().int().min(1, { message: "Quantity must be at least 1" }),
  file: z.instanceof(File).optional()
});

const eventTicketFormSchema = z.object({
  eventId: z.string().uuid({ message: "Please select an event" }),
  price: z.coerce.number().positive({ message: "Price must be greater than 0" }),
  description: z.string().optional(),
  file: z.instanceof(File).optional()
});

type CustomFormValues = z.infer<typeof customTicketFormSchema>;
type EventFormValues = z.infer<typeof eventTicketFormSchema>;

export function AddTicketForm({ onClose }: { onClose: () => void }) {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { addTicket } = useUserTickets(user?.id);
  const { uploadTicketFile, uploading, error: uploadError } = useTicketStorage();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketType, setTicketType] = useState<'event' | 'custom'>('event');
  
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const eventForm = useForm<EventFormValues>({
    resolver: zodResolver(eventTicketFormSchema),
    defaultValues: {
      eventId: '',
      price: undefined,
      description: '',
    },
  });
  
  const customForm = useForm<CustomFormValues>({
    resolver: zodResolver(customTicketFormSchema),
    defaultValues: {
      title: '',
      categoryId: '',
      price: undefined,
      description: '',
      quantity: 1,
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const onSubmitEventTicket = async (values: EventFormValues) => {
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
        file_path: filePath,
        quantity: 1,
      });
      
      onClose(); // Close dialog after submission
    } catch (error) {
      console.error("Error adding ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onSubmitCustomTicket = async (values: CustomFormValues) => {
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
      
      // Get category name
      const categoryName = categories?.find(cat => cat.id === values.categoryId)?.name || '';
      
      // Add ticket to database, creating multiple tickets based on quantity
      for (let i = 0; i < values.quantity; i++) {
        await addTicket({
          title: values.title,
          description: values.description || null,
          event_id: null, // No event ID for custom tickets
          price: values.price,
          user_id: user.id,
          file_path: filePath,
          category_name: categoryName,
          category_id: values.categoryId,
          quantity: 1, // Each ticket is added individually
        });
      }
      
      onClose(); // Close dialog after submission
    } catch (error) {
      console.error("Error adding custom ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <Tabs 
        defaultValue="event" 
        value={ticketType} 
        onValueChange={(value) => setTicketType(value as 'event' | 'custom')}
        className="mb-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="event">
            {t("Pasākuma biļete", "Event Ticket")}
          </TabsTrigger>
          <TabsTrigger value="custom">
            {t("Pielāgota biļete", "Custom Ticket")}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="event">
          <Form {...eventForm}>
            <form onSubmit={eventForm.handleSubmit(onSubmitEventTicket)} className="space-y-4">
              <FormField
                control={eventForm.control}
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
                control={eventForm.control}
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
                control={eventForm.control}
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
        </TabsContent>
        
        <TabsContent value="custom">
          <Form {...customForm}>
            <form onSubmit={customForm.handleSubmit(onSubmitCustomTicket)} className="space-y-4">
              <FormField
                control={customForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Nosaukums", "Title")}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t("Biļetes nosaukums", "Ticket title")} 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={customForm.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Kategorija", "Category")}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={categoriesLoading || isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Izvēlēties kategoriju", "Select a category")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={customForm.control}
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
                control={customForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Biļešu skaits", "Number of tickets")}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        placeholder="1" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={customForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Apraksts (neobligāts)", "Description (optional)")}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t("Papildus informācija par biļeti...", "Additional ticket information...")} 
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
                      {t("Pievienot biļetes", "Add tickets")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
