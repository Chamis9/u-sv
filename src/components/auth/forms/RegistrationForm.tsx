
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { checkEmailExists, checkPhoneExists } from "@/utils/phoneUtils";

interface RegistrationFormProps {
  translations: any;
  languageCode: string;
  onClose: () => void;
}

export function RegistrationForm({ translations, languageCode, onClose }: RegistrationFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

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
      termsAccepted: false,
      newsletter: false,
    },
  });

  const onSubmit = async (values: RegistrationFormData) => {
    setIsLoading(true);
    
    try {
      const phoneNumber = values.phoneNumber 
        ? `${values.countryCode}${values.phoneNumber}` 
        : null;

      // Check if email exists
      const emailExists = await checkEmailExists(values.email);
      if (emailExists) {
        toast({
          variant: "destructive",
          title: languageCode === 'lv' ? "Kļūda" : "Error",
          description: languageCode === 'lv' 
            ? "E-pasta adrese jau ir reģistrēta" 
            : "Email is already registered",
        });
        setIsLoading(false);
        return;
      }

      // Check if phone exists (if provided)
      if (phoneNumber) {
        const phoneExists = await checkPhoneExists(phoneNumber);
        if (phoneExists) {
          toast({
            variant: "destructive",
            title: languageCode === 'lv' ? "Kļūda" : "Error",
            description: languageCode === 'lv'
              ? "Telefona numurs jau ir reģistrēts"
              : "Phone number is already registered",
          });
          setIsLoading(false);
          return;
        }
      }

      const savedEmails = localStorage.getItem('globalPreviousEmails');
      const emails = savedEmails ? JSON.parse(savedEmails) : [];
      if (!emails.includes(values.email)) {
        emails.unshift(values.email);
        const updatedEmails = emails.slice(0, 5);
        localStorage.setItem('globalPreviousEmails', JSON.stringify(updatedEmails));
      }

      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            phone: phoneNumber,
            newsletter: values.newsletter
          }
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: languageCode === 'lv' ? "Kļūda" : "Error",
          description: error.message || translations.registrationError,
        });
      } else {
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
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="termsAccepted"
            checked={form.watch("termsAccepted")} 
            onCheckedChange={(checked) => {
              form.setValue("termsAccepted", checked === true);
            }}
          />
          <Label 
            htmlFor="termsAccepted" 
            className="text-sm cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              form.setValue("termsAccepted", !form.watch("termsAccepted"));
            }}
          >
            {languageCode === 'lv' ? 
              'Es piekrītu lietošanas noteikumiem' : 
              'I agree to the terms and conditions'}
          </Label>
        </div>
        {form.formState.errors.termsAccepted && (
          <p className="text-sm text-red-500 -mt-2">
            {form.formState.errors.termsAccepted.message}
          </p>
        )}
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="newsletter"
            checked={form.watch("newsletter")}
            onCheckedChange={(checked) => {
              form.setValue("newsletter", checked === true);
            }}
          />
          <Label 
            htmlFor="newsletter" 
            className="text-sm cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              form.setValue("newsletter", !form.watch("newsletter"));
            }}
          >
            {languageCode === 'lv' ? 
              'Es vēlos saņemt jaunumus' : 
              'I want to receive newsletter'}
          </Label>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? translations.registrationLoading : translations.register}
        </Button>
      </form>
    </Form>
  );
}
