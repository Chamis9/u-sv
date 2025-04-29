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
import { TermsCheckbox } from "./components/TermsCheckbox";
import { NameFields } from "./components/NameFields";

interface RegistrationFormProps {
  translations: any;
  onClose: () => void;
}

// Keep track of last signup attempt across component instances
const lastSignupAttempts = new Map<string, number>();

export function RegistrationForm({ translations, onClose }: RegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownError, setCooldownError] = useState<string | null>(null);
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

  const checkCooldown = (email: string): boolean => {
    const now = Date.now();
    const lastAttempt = lastSignupAttempts.get(email);
    
    // If no previous attempt or cooldown has passed (60 seconds)
    if (!lastAttempt || (now - lastAttempt) > 60000) {
      lastSignupAttempts.set(email, now);
      setCooldownError(null);
      return true;
    }
    
    // Calculate remaining cooldown time
    const remainingSeconds = Math.ceil((60000 - (now - lastAttempt)) / 1000);
    setCooldownError(
      translations.languageCode === 'lv' 
        ? `Lūdzu, uzgaidiet ${remainingSeconds} sekundes pirms jauna mēģinājuma.` 
        : `Please wait ${remainingSeconds} seconds before trying again.`
    );
    
    return false;
  };

  const onSubmit = async (values: RegistrationFormData) => {
    if (!checkCooldown(values.email)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
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
        if (error.status === 429) {
          toast({
            variant: "destructive",
            description: translations.emailRateLimitExceeded || "Email rate limit exceeded. Please try again later.",
          });
          // Force a long cooldown after rate limit error
          lastSignupAttempts.set(values.email, Date.now());
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
        
        {cooldownError && (
          <div className="text-sm font-medium text-destructive">{cooldownError}</div>
        )}
        
        <PasswordInput form={form} label={translations.password} />
        <PasswordInput
          form={form}
          name="confirmPassword"
          label={translations.confirmPassword}
        />

        <PhoneField form={form} translations={translations} />
        
        <TermsCheckbox form={form} translations={translations} />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? translations.registrationLoading : translations.register}
          </Button>
        </div>
      </form>
    </Form>
  );
}
