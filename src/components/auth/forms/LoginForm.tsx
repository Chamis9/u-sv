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

interface LoginFormProps {
  translations: any;
  onClose: () => void;
}

export function LoginForm({ translations, onClose }: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
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
      // Save email to localStorage for future autofill suggestions
      const savedEmails = localStorage.getItem('globalPreviousEmails');
      const emails = savedEmails ? JSON.parse(savedEmails) : [];
      if (!emails.includes(values.email)) {
        emails.unshift(values.email);
        // Keep only the last 5 emails
        const updatedEmails = emails.slice(0, 5);
        localStorage.setItem('globalPreviousEmails', JSON.stringify(updatedEmails));
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast({
          variant: "destructive",
          description: translations.invalidCredentials,
        });
      } else {
        // Only close on successful login
        if (onClose) onClose();
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

  // Modified autofill handling to prevent premature form closing
  React.useEffect(() => {
    let observer: MutationObserver | null = null;
    
    const handleAutoFill = () => {
      // Use mutation observer to detect when autofill happens
      const formElement = document.querySelector('form');
      
      if (formElement && !observer) {
        observer = new MutationObserver((mutations) => {
          // Check for autofilled inputs by looking at their background color
          const autofilled = document.querySelectorAll('input:-webkit-autofill');
          if (autofilled.length > 0) {
            // Get the values without triggering form submission
            setTimeout(() => {
              const emailValue = form.getValues("email");
              const passwordValue = form.getValues("password");
              
              if (emailValue) form.setValue("email", emailValue);
              if (passwordValue) form.setValue("password", passwordValue);
            }, 100);
          }
        });
        
        // Observe changes to the form
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
          // Prevent autofill from bubbling up and closing hover cards
          e.stopPropagation();
        }}
        onClick={(e) => {
          // Prevent clicks from bubbling up and closing hover cards
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
