
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useLanguage } from "@/features/language";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";

// Import the refactored components
import { FormHeader } from "./form/FormHeader";
import { EventDetailsFields } from "./form/EventDetailsFields";
import { DateTimeField } from "./form/DateTimeField";
import { PriceField } from "./form/PriceField";
import { FileUploadField } from "./form/FileUploadField";
import { SubmitButton } from "./form/SubmitButton";

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
      <FormHeader />
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EventDetailsFields form={form} categories={categories} />
            
            <DateTimeField form={form} />
            
            <PriceField form={form} />
            
            <FileUploadField 
              form={form}
              name="eventImage"
              label={t("Pasākuma attēls", "Event image")}
              description={t("Pievienojiet pasākuma attēlu (neobligāti)", "Add an event image (optional)")}
              fileName={eventImageName}
              onFileChange={onEventImageChange}
              accept="image/*"
            />
            
            <FileUploadField 
              form={form}
              name="ticketFile"
              label={t("Biļetes fails", "Ticket file")}
              description={t("Pievienojiet biļetes failu (redzams tikai jums)", "Upload ticket file (visible only to you)")}
              fileName={ticketFileName}
              onFileChange={onTicketFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
            />
            
            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </Form>
      </CardContent>
      <LoginDialog isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
    </Card>
  );
}
