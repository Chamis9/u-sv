
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { RegistrationFormData } from "../hooks/useRegistrationForm";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordFieldsProps {
  form: UseFormReturn<RegistrationFormData>;
  t: (lvText: string, enText: string) => string;
  passwordValidation: any;
  validatePassword: (value: string) => true | string;
}

export const PasswordFields = ({ 
  form, 
  t, 
  passwordValidation, 
  validatePassword 
}: PasswordFieldsProps) => {
  const { register, formState: { errors } } = form;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="password">{t('Parole', 'Password')}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password", passwordValidation)}
            placeholder={t('Ievadiet paroli', 'Enter your password')}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showPassword ? t('Slēpt paroli', 'Hide password') : t('Parādīt paroli', 'Show password')}
            </span>
          </Button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          {t('Apstiprināt paroli', 'Confirm Password')}
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: t('Lauks ir obligāts', 'This field is required'),
              validate: validatePassword
            })}
            placeholder={t('Ievadiet paroli vēlreiz', 'Re-enter your password')}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showConfirmPassword ? t('Slēpt paroli', 'Hide password') : t('Parādīt paroli', 'Show password')}
            </span>
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>
    </>
  );
};
