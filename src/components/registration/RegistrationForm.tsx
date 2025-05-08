
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRegistrationForm } from "./hooks/useRegistrationForm";
import { PersonalInfoFields } from "./components/PersonalInfoFields";
import { PasswordFields } from "./components/PasswordFields";
import { PhoneInputWithCountry } from "@/components/admin/users/PhoneInputWithCountry";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
  const { form, passwordValidation, validatePassword, onSubmit, t } = useRegistrationForm();
  const { handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = form;

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>{t('Pieteikuma forma', 'Registration Form')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoFields form={form} t={t} />

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              {t('E-pasts', 'Email')}
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded border border-gray-300 px-3 py-2"
              placeholder={t('Ievadiet e-pastu', 'Enter your email')}
              {...form.register("email", {
                required: t('Lauks ir obligāts', 'This field is required'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('Ievadiet derīgu e-pasta adresi', 'Enter a valid email address')
                }
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <PasswordFields 
            form={form} 
            t={t} 
            passwordValidation={passwordValidation}
            validatePassword={validatePassword}
          />

          <PhoneInputWithCountry
            label={t('Telefona numurs', 'Phone Number')}
            countryCode={watch('countryCode')}
            phoneNumber={watch('phoneNumber') || ""}
            onCountryCodeChange={(code) => setValue('countryCode', code)}
            onPhoneNumberChange={(number) => setValue('phoneNumber', number)}
            error={errors.phoneNumber?.message}
            placeholder="XXXXXXXX"
            required={false}
          />

          <div className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 
                t('Notiek reģistrācija...', 'Registering...') : 
                t('Reģistrēties', 'Register')}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t('Jau ir konts?', 'Already have an account?')}{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:underline"
                >
                  {t('Pieslēgties', 'Login')}
                </Link>
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
