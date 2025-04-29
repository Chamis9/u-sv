
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/features/language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { PersonalInfoFields } from "@/components/registration/components/PersonalInfoFields";
import { PasswordFields } from "@/components/registration/components/PasswordFields";
import PhoneInputWithCountry from "@/components/admin/users/PhoneInputWithCountry";
import { useRegistrationForm } from "@/hooks/useRegistrationForm";

const Registration = () => {
  const { currentLanguage } = useLanguage();
  const { form, passwordValidation, validatePassword, onSubmit, t } = useRegistrationForm();
  const { handleSubmit, watch, setValue, register, formState: { errors } } = form;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>{t('Reģistrācija - netieku.es', 'Registration - netieku.es')}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 pt-20">
        <Card className="max-w-xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>{t('Reģistrācija', 'Registration')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <PersonalInfoFields form={form} t={t} />

                <div className="space-y-2">
                  <Label htmlFor="email">{t('E-pasts', 'Email')}</Label>
                  <input
                    id="email"
                    type="email"
                    className="w-full p-2 border rounded"
                    {...register("email", {
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

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="termsAccepted" 
                    {...register("termsAccepted", { 
                      required: t('Jums jāpiekrīt lietošanas noteikumiem', 'You must accept the terms and conditions') 
                    })}
                  />
                  <Label htmlFor="termsAccepted" className="text-sm">
                    {t(
                      'Es piekrītu lietošanas noteikumiem un privātuma politikai', 
                      'I agree to the terms and conditions and privacy policy'
                    )}
                  </Label>
                </div>
                {errors.termsAccepted && (
                  <p className="text-sm text-red-500">{errors.termsAccepted.message}</p>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" {...register("newsletter")} />
                  <Label htmlFor="newsletter" className="text-sm">
                    {t(
                      'Es vēlos saņemt jaunumus par akcijām un piedāvājumiem',
                      'I want to receive news about promotions and offers'
                    )}
                  </Label>
                </div>

                <Button type="submit" className="w-full">
                  {t('Reģistrēties', 'Register')}
                </Button>

                <div className="text-center text-sm">
                  {t('Jau ir konts?', 'Already have an account?')}{' '}
                  <Link to="/" className="text-primary hover:underline">
                    {t('Ieiet', 'Login')}
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
