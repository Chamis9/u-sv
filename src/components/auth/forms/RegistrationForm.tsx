
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailInput } from "../EmailInput";
import { PasswordInput } from "../PasswordInput";
import PhoneInputWithCountry from "@/components/admin/users/PhoneInputWithCountry";
import { getRegistrationFormSchema, type RegistrationFormData } from "../schema";

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
    },
  });

  const onSubmit = async (values: RegistrationFormData) => {
    setIsLoading(true);
    const phoneNumber = values.phoneNumber 
      ? `${values.countryCode || '+371'}${values.phoneNumber}` 
      : null;

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
          phone: phoneNumber,
        }
      }
    });

    if (error) {
      toast({
        variant: "destructive",
        description: translations.registrationError,
      });
    } else {
      toast({
        description: translations.registrationSuccess,
      });
      onClose();
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{translations.firstName}</Label>
            <Input
              id="firstName"
              {...form.register("firstName")}
              placeholder={translations.firstNamePlaceholder}
            />
            {form.formState.errors.firstName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{translations.lastName}</Label>
            <Input
              id="lastName"
              {...form.register("lastName")}
              placeholder={translations.lastNamePlaceholder}
            />
            {form.formState.errors.lastName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </div>
        </div>
        
        <EmailInput form={form} label={translations.email} />
        
        <PhoneInputWithCountry
          label={translations.phoneNumber}
          countryCode={form.watch('countryCode')}
          phoneNumber={form.watch('phoneNumber') || ""}
          onCountryCodeChange={(code) => form.setValue('countryCode', code)}
          onPhoneNumberChange={(number) => form.setValue('phoneNumber', number)}
          placeholder={translations.phoneNumberPlaceholder}
        />
        
        <PasswordInput form={form} label={translations.password} />
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{translations.confirmPassword}</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...form.register("confirmPassword")}
            placeholder={translations.confirmPasswordPlaceholder}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? translations.registrationLoading : translations.register}
        </Button>
      </form>
    </Form>
  );
}
