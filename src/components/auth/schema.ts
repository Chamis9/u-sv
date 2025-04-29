
import { z } from "zod";

export const getRegistrationFormSchema = (languageCode: string) => {
  const translations = {
    required: languageCode === 'lv' ? "Lauks ir obligāts" : "This field is required",
    emailInvalid: languageCode === 'lv' ? "E-pasta adrese nav derīga" : "Email is not valid",
    passwordMin: languageCode === 'lv' ? "Parolei jābūt vismaz 6 simboli gara" : "Password must be at least 6 characters",
    passwordsNotMatch: languageCode === 'lv' ? "Paroles nesakrīt" : "Passwords do not match",
  };

  return z.object({
    firstName: z.string().min(1, { message: translations.required }),
    lastName: z.string().min(1, { message: translations.required }),
    email: z.string().min(1, { message: translations.required }).email({ message: translations.emailInvalid }),
    password: z.string().min(6, { message: translations.passwordMin }),
    confirmPassword: z.string().min(1, { message: translations.required }),
    countryCode: z.string(),
    phoneNumber: z.string().optional(),
    termsAccepted: z.boolean().optional().default(false),
    newsletter: z.boolean().optional().default(false),
  }).refine((data) => data.password === data.confirmPassword, {
    message: translations.passwordsNotMatch,
    path: ["confirmPassword"],
  });
};

// Add loginFormSchema that was missing
export const loginFormSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Email is not valid" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type RegistrationFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  countryCode: string;
  phoneNumber: string;
  termsAccepted: boolean;
  newsletter: boolean;
};

// Add LoginFormData type that was missing
export type LoginFormData = z.infer<typeof loginFormSchema>;
