
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { EmailInput } from "../EmailInput";
import { PasswordInput } from "../PasswordInput";
import { loginFormSchema, type LoginFormData } from "../schema";
import { usePreviousEmails } from "@/hooks/usePreviousEmails";
import { useUserAuth } from "@/hooks/useUserAuth";

interface LoginFormProps {
  translations: any;
  languageCode?: string;
  onClose: () => void;
}

export function LoginForm({ translations, languageCode, onClose }: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const { login } = useUserAuth();
  const { previousEmails, showDropdown, setShowDropdown } = usePreviousEmails();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleResetPassword = async () => {
    const email = form.getValues("email");
    if (!email) {
      form.setFocus("email");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setIsLoading(false);

    if (!error) {
      toast({
        description: translations.resetPasswordSent,
      });
    }
  };

  const onSubmit = async (values: LoginFormData) => {
    setIsLoading(true);
    
    try {
      // Save email to local storage for future use
      const savedEmails = localStorage.getItem('globalPreviousEmails');
      const emails = savedEmails ? JSON.parse(savedEmails) : [];
      if (!emails.includes(values.email)) {
        emails.unshift(values.email);
        const updatedEmails = emails.slice(0, 5);
        localStorage.setItem('globalPreviousEmails', JSON.stringify(updatedEmails));
      }

      // Login using the custom hook
      const success = await login(values.email, values.password);
      
      if (success) {
        if (onClose) onClose();
      } else {
        toast({
          variant: "destructive",
          description: translations.invalidCredentials,
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      toast({
        variant: "destructive",
        description: translations.invalidCredentials,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle autofill detection
  React.useEffect(() => {
    let observer: MutationObserver | null = null;
    
    const handleAutoFill = () => {
      const formElement = document.querySelector('form');
      
      if (formElement && !observer) {
        observer = new MutationObserver((mutations) => {
          const autofilled = document.querySelectorAll('input:-webkit-autofill');
          if (autofilled.length > 0) {
            setTimeout(() => {
              const emailValue = form.getValues("email");
              const passwordValue = form.getValues("password");
              
              if (emailValue) form.setValue("email", emailValue);
              if (passwordValue) form.setValue("password", passwordValue);
              
              const stopEvents = (e: Event) => {
                e.stopPropagation();
              };
              
              formElement.addEventListener('click', stopEvents as EventListener, true);
              formElement.addEventListener('focus', stopEvents as EventListener, true);
              
              setTimeout(() => {
                formElement.removeEventListener('click', stopEvents as EventListener, true);
                formElement.removeEventListener('focus', stopEvents as EventListener, true);
              }, 1000);
            }, 100);
          }
        });
        
        observer.observe(formElement, {
          subtree: true,
          childList: true,
          attributeFilter: ['style', 'class'],
          attributes: true
        });
      }
    };
    
    handleAutoFill();
    
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [form]);

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-4"
        onFocus={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <EmailInput form={form} label={translations.email} />
        <PasswordInput form={form} label={translations.password} />
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="link"
            className="px-0"
            onClick={handleResetPassword}
            disabled={isLoading}
          >
            {translations.forgotPassword}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? translations.loginLoading : translations.login}
          </Button>
        </div>
      </form>
    </Form>
  );
}
