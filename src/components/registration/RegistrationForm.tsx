
import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/features/language";
import { validatePhoneNumber } from "@/utils/phoneUtils";

interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
}

const RegistrationForm = () => {
  const { currentLanguage } = useLanguage();
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationFormData>();

  const onSubmit = async (data: RegistrationFormData) => {
    console.log("Form submitted:", data);
    // Implementation will be added later
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>{t('Pieteikuma forma', 'Registration Form')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('Vārds Uzvārds', 'Full Name')}</Label>
            <Input
              id="name"
              {...register("name", { required: t('Lauks ir obligāts', 'This field is required') })}
              placeholder={t('Ievadiet vārdu un uzvārdu', 'Enter your full name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('E-pasts', 'Email')}</Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: t('Lauks ir obligāts', 'This field is required'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('Ievadiet derīgu e-pasta adresi', 'Enter a valid email address')
                }
              })}
              placeholder={t('Ievadiet e-pastu', 'Enter your email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('Telefona numurs', 'Phone Number')}</Label>
            <Input
              id="phone"
              {...register("phone", {
                required: t('Lauks ir obligāts', 'This field is required'),
                validate: (value) => 
                  validatePhoneNumber(value) || 
                  t('Ievadiet derīgu 8 ciparu telefona numuru', 'Enter a valid 8-digit phone number')
              })}
              placeholder="12345678"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            {t('Iesniegt', 'Submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
