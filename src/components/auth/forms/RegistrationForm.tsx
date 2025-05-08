
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { EmailInput } from "../EmailInput";
import { NameFields } from "./components/NameFields";
import { PhoneField } from "./components/PhoneField";
import { PasswordFields } from "./components/PasswordFields";
import { getRegistrationFormSchema, type RegistrationFormData } from "../schema";
import { useState } from "react";
import { useUserAuth } from "@/hooks/useUserAuth";

interface RegistrationFormProps {
  translations: any;
  languageCode: string;
  onClose: () => void;
}

export function RegistrationForm({ translations, languageCode, onClose }: RegistrationFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const { register: registerUser } = useUserAuth();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(getRegistrationFormSchema(languageCode)),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      countryCode: "+371",
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: RegistrationFormData) => {
    setIsLoading(true);
    
    try {
      // Save email in local storage
      const savedEmails = localStorage.getItem('globalPreviousEmails');
      const emails = savedEmails ? JSON.parse(savedEmails) : [];
      if (!emails.includes(values.email)) {
        emails.unshift(values.email);
        const updatedEmails = emails.slice(0, 5);
        localStorage.setItem('globalPreviousEmails', JSON.stringify(updatedEmails));
      }

      console.log('Registering user with email:', values.email);

      // Register the user through our custom hook
      const success = await registerUser(values.email, values.password, {
        firstName: values.firstName,
        lastName: values.lastName,
        countryCode: values.countryCode,
        phoneNumber: values.phoneNumber,
      });

      if (success) {
        toast({
          description: translations.registrationSuccess,
        });
        if (onClose) onClose();
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast({
        variant: "destructive",
        description: translations.registrationError,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle autofill detection
  React.useEffect(() => {
    let observer: MutationObserver | null = null;
    
    const handleAutoFill = () => {
      const formElement = document.querySelector('form');
      
      if (formElement && !observer) {
        observer = new MutationObserver((mutations) => {
          const autofilled = document.querySelectorAll('input:-webkit-autofill');
          if (autofilled.length > 0) {
            setTimeout(() => {
              const formFields = form.getValues();
              Object.keys(formFields).forEach((key) => {
                if (formFields[key]) {
                  form.setValue(key as any, formFields[key]);
                }
              });
              
              // Stop propagation of all events to prevent the hover card from closing
              const stopEvents = (e: Event) => {
                e.stopPropagation();
              };
              
              formElement.addEventListener('click', stopEvents as EventListener, true);
              formElement.addEventListener('focus', stopEvents as EventListener, true);
              
              setTimeout(() => {
                formElement.removeEventListener('click', stopEvents as EventListener, true);
                formElement.removeEventListener('focus', stopEvents as EventListener, true);
              }, 1000);
            }, 100);
          }
        });
        
        observer.observe(formElement, {
          subtree: true,
          childList: true,
          attributeFilter: ['style', 'class'],
          attributes: true
        });
      }
    };
    
    handleAutoFill();
    
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [form]);

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-4"
        onFocus={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <NameFields form={form} translations={translations} />
        <EmailInput form={form} label={translations.email} />
        <PhoneField form={form} translations={translations} />
        <PasswordFields form={form} translations={translations} />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? translations.registrationLoading : translations.register}
        </Button>
      </form>
    </Form>
  );
}
