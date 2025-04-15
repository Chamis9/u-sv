
import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/features/language";
import { validatePhoneNumber, checkEmailExists, checkPhoneExists } from "@/utils/phoneUtils";
import { Checkbox } from "@/components/ui/checkbox";
import PhoneInputWithCountry from "@/components/admin/users/PhoneInputWithCountry";

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  countryCode: string;
  phoneNumber: string;
  termsAccepted: boolean;
  newsletter: boolean;
}

const RegistrationForm = () => {
  const { currentLanguage } = useLanguage();
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<RegistrationFormData>({
    defaultValues: {
      countryCode: "+371",
      phoneNumber: "",
      newsletter: false,
      termsAccepted: false
    }
  });

  const passwordValidation = {
    required: t('Lauks ir obligāts', 'This field is required'),
    minLength: {
      value: 8,
      message: t('Vismaz 8 simboli', 'Minimum 8 characters')
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: t(
        'Parolei jāsatur vismaz 1 lielais burts, 1 mazais burts, 1 cipars un 1 īpašais simbols',
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
      )
    }
  };

  const validatePassword = (value: string) => {
    const password = watch('password');
    if (!value || !password || value !== password) {
      return t('Paroles nesakrīt', 'Passwords do not match');
    }
    return true;
  };

  const onSubmit = async (data: RegistrationFormData) => {
    // Safely handle phone number by ensuring it's not undefined
    const phoneNumber = data.phoneNumber || "";
    const countryCode = data.countryCode || "+371";
    
    // Check if email exists
    const emailExists = await checkEmailExists(data.email);
    if (emailExists) {
      return {
        email: t('E-pasta adrese jau ir reģistrēta', 'Email is already registered')
      };
    }

    // Check if phone exists - only if phone is provided
    if (phoneNumber.trim()) {
      const phoneExists = await checkPhoneExists(`${countryCode}${phoneNumber}`);
      if (phoneExists) {
        return {
          phone: t('Telefona numurs jau ir reģistrēts', 'Phone number is already registered')
        };
      }
    }

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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('Vārds', 'First Name')}</Label>
              <Input
                id="firstName"
                {...register("firstName", { required: t('Lauks ir obligāts', 'This field is required') })}
                placeholder={t('Ievadiet vārdu', 'Enter your first name')}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">{t('Uzvārds', 'Last Name')}</Label>
              <Input
                id="lastName"
                {...register("lastName", { required: t('Lauks ir obligāts', 'This field is required') })}
                placeholder={t('Ievadiet uzvārdu', 'Enter your last name')}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
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
            <Label htmlFor="password">{t('Parole', 'Password')}</Label>
            <Input
              id="password"
              type="password"
              {...register("password", passwordValidation)}
              placeholder={t('Ievadiet paroli', 'Enter your password')}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('Apstiprināt paroli', 'Confirm Password')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", {
                required: t('Lauks ir obligāts', 'This field is required'),
                validate: validatePassword
              })}
              placeholder={t('Ievadiet paroli vēlreiz', 'Re-enter your password')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <PhoneInputWithCountry
            label={t('Telefona numurs', 'Phone Number')}
            countryCode={watch('countryCode')}
            phoneNumber={watch('phoneNumber') || ""}
            onCountryCodeChange={(code) => setValue('countryCode', code)}
            onPhoneNumberChange={(number) => setValue('phoneNumber', number)}
            error={errors.phoneNumber?.message}
            required={false}
            placeholder="12345678"
          />

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

          <Button type="submit" className="w-full">
            {t('Iesniegt', 'Submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
