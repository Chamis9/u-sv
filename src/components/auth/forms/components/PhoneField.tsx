
import React from "react";
import PhoneInputWithCountry from "@/components/admin/users/PhoneInputWithCountry";
import { UseFormReturn } from "react-hook-form";
import { RegistrationFormData } from "../schema";

interface PhoneFieldProps {
  form: UseFormReturn<RegistrationFormData>;
  translations: any;
}

export function PhoneField({ form, translations }: PhoneFieldProps) {
  return (
    <PhoneInputWithCountry
      label={translations.phoneNumber}
      countryCode={form.watch('countryCode')}
      phoneNumber={form.watch('phoneNumber') || ""}
      onCountryCodeChange={(code) => form.setValue('countryCode', code)}
      onPhoneNumberChange={(number) => form.setValue('phoneNumber', number)}
      placeholder={translations.phoneNumberPlaceholder}
    />
  );
}
