
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { EmailInput } from "../EmailInput";
import { PasswordInput } from "../PasswordInput";
import { loginFormSchema, type LoginFormData } from "../schema";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/features/language";

interface LoginFormProps {
  onClose: () => void;
  translations?: any; // Add translations prop
}

export function LoginForm({ onClose, translations }: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  // Use translations if provided, otherwise use t function
  const getText = (key: string, lvText: string, enText: string) => {
    if (translations && translations[key]) {
      return translations[key];
    }
    return t(lvText, enText);
  };

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const success = await login(values.email, values.password);

      if (success) {
        if (onClose) onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-4"
      >
        <EmailInput 
          form={form} 
          label={translations?.email || t('E-pasts', 'Email')} 
        />
        <PasswordInput 
          form={form} 
          label={translations?.password || t('Parole', 'Password')} 
        />
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="link"
            className="px-0"
            onClick={() => {}} // Simplified for now
            disabled={isLoading}
          >
            {translations?.forgotPassword || t('Aizmirsu paroli', 'Forgot Password')}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading 
              ? (translations?.loginLoading || t('Pieslēdzas...', 'Logging in...')) 
              : (translations?.login || t('Pieslēgties', 'Login'))}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default LoginForm;
