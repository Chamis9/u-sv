
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { RegistrationFormData } from "../hooks/useRegistrationForm";

interface TermsAndNewsletterProps {
  form: UseFormReturn<RegistrationFormData>;
  t: (lvText: string, enText: string) => string;
}

export const TermsAndNewsletter = ({ form, t }: TermsAndNewsletterProps) => {
  const { register, formState: { errors }, watch } = form;
  const termsAccepted = watch("termsAccepted");

  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="termsAccepted"
          {...register("termsAccepted", {
            required: t('Jums jāpiekrīt noteikumiem', 'You must accept the terms')
          })}
        />
        <Label htmlFor="termsAccepted" className="text-sm">
          {t('Es piekrītu lietošanas noteikumiem', 'I agree to the terms and conditions')}
        </Label>
      </div>
      {errors.termsAccepted && (
        <p className="text-sm text-red-500">{errors.termsAccepted.message}</p>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="newsletter"
          {...register("newsletter")}
        />
        <Label htmlFor="newsletter" className="text-sm">
          {t('Vēlos saņemt jaunumus', 'I want to receive newsletters')}
        </Label>
      </div>
    </>
  );
};
