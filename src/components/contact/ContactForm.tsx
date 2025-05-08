
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormProps {
  translations: {
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    successMessage: string;
    errorMessage: string;
  };
}

export const ContactForm: React.FC<ContactFormProps> = ({ translations: t }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    message: z.string().min(10, {
      message: "Message must be at least 10 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    mode: "onSubmit", // Only validate on submit
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { data: responseData, error } = await supabase.functions.invoke('send-user-email', {
        body: {
          name: data.name,
          email: data.email,
          message: data.message
        }
      });
      
      if (error) {
        console.error('Error sending message:', error);
        throw new Error(error.message || t.errorMessage);
      }
      
      toast.success(t.successMessage);
      
      // Completely reset the form with clean state
      form.reset({
        name: "",
        email: "",
        message: "",
      }, {
        // This is the key part - it prevents showing validation errors
        keepErrors: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      });
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || t.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-ticket-bg/70 backdrop-blur-sm p-6 rounded-lg border border-ticket-text/10 shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-ticket-text">{t.formTitle}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-ticket-text">
                  {t.nameLabel}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t.namePlaceholder} 
                    {...field} 
                    className="bg-ticket-bg/30 border-ticket-text/20 text-ticket-text placeholder:text-ticket-text/50 focus-visible:ring-ticket-accent focus-visible:border-ticket-accent"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-ticket-text">
                  {t.emailLabel}
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder={t.emailPlaceholder} 
                    {...field} 
                    className="bg-ticket-bg/30 border-ticket-text/20 text-ticket-text placeholder:text-ticket-text/50 focus-visible:ring-ticket-accent focus-visible:border-ticket-accent"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-ticket-text">
                  {t.messageLabel}
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t.messagePlaceholder} 
                    rows={5} 
                    {...field} 
                    className="bg-ticket-bg/30 border-ticket-text/20 text-ticket-text placeholder:text-ticket-text/50 focus-visible:ring-ticket-accent focus-visible:border-ticket-accent"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-ticket-accent hover:bg-ticket-accent/80 text-ticket-bg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-ticket-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.submitButton}
              </span>
            ) : (
              t.submitButton
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
