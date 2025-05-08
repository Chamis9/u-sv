
import * as z from "zod";

export const loginFormSchema = z.object({
  email: z.string().email("Lūdzu, ievadiet derīgu e-pasta adresi"),
  password: z.string().min(6, "Parole jāsatur vismaz 6 rakstzīmes"),
});

export const getRegistrationFormSchema = (languageCode: string) => {
  const translations = {
    passwordMinLength: languageCode === 'lv' 
      ? "Parolei jābūt vismaz 8 rakstzīmes garai"
      : "Password must be at least 8 characters long"
  };
  
  return z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email(),
    password: z.string().min(8, translations.passwordMinLength),
    confirmPassword: z.string().min(8, translations.passwordMinLength),
    countryCode: z.string().optional(),
    phoneNumber: z.string().optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
};

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegistrationFormData = z.infer<ReturnType<typeof getRegistrationFormSchema>>;
