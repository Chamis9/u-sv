
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { EmailInput } from "../EmailInput";
import { PasswordInput } from "../PasswordInput";
import { getRegistrationFormSchema, type RegistrationFormData } from "../schema";
import { PhoneField } from "./components/PhoneField";
import { NameFields } from "./components/NameFields";

interface RegistrationFormProps {
  translations: any;
  onClose: () => void;
}

export function RegistrationForm({ translations, onClose }: RegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const schema = getRegistrationFormSchema(translations.languageCode || "en");
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      countryCode: "+371", // Latvia country code
      phoneNumber: "",
      termsAccepted: false,
      newsletter: false,
    },
  });

  const onSubmit = async (values: RegistrationFormData) => {
    setIsLoading(true);
    
    try {
      console.log("Registration data:", values);
      
      // Using signUp with email verification disabled (in Supabase admin)
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            phone: values.phoneNumber ? `${values.countryCode}${values.phoneNumber}` : undefined,
          },
        },
      });

      if (error) {
        // Check for specific error codes
        if (error.message.includes('Email signups are disabled') || error.message.includes('email_provider_disabled')) {
          toast({
            variant: "destructive",
            description: "Email registration is currently disabled in the system. Please contact the administrator.",
          });
        } else {
          toast({
            variant: "destructive",
            description: error.message,
          });
        }
        return;
      }

      // Success message - updated for manual confirmation flow
      toast({
        description: translations.manualConfirmation || "Registration successful! Please wait for admin confirmation.",
      });
      
      if (onClose) onClose();
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        description: translations.genericError || "Registration error. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <NameFields form={form} translations={translations} />
        
        <EmailInput form={form} label={translations.email} />
        
        <PasswordInput form={form} label={translations.password} />
        <PasswordInput
          form={form}
          name="confirmPassword"
          label={translations.confirmPassword}
        />

        <PhoneField form={form} translations={translations} />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? translations.registrationLoading : translations.register}
          </Button>
        </div>
      </form>
    </Form>
  );
}
