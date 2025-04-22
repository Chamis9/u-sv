import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/features/language";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { loginFormSchema, registrationFormSchema, type LoginFormData, type RegistrationFormData } from "./schema";
import { getLoginTranslations } from "./translations";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInputWithCountry from "@/components/admin/users/PhoneInputWithCountry";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const translations = getLoginTranslations(currentLanguage.code);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registrationForm = useForm<RegistrationFormData>({
    resolver: zodResolver(getRegistrationFormSchema(currentLanguage.code)),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      countryCode: "+371",
      phoneNumber: "",
    },
  });

  const handleResetPassword = async () => {
    const email = loginForm.getValues("email");
    if (!email) {
      loginForm.setFocus("email");
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

  const onLoginSubmit = async (values: LoginFormData) => {
    setIsLoading(true);
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
      onClose();
    }
    setIsLoading(false);
  };

  const onRegisterSubmit = async (values: RegistrationFormData) => {
    setIsLoading(true);
    const phoneNumber = values.phoneNumber 
      ? `${values.countryCode || '+371'}${values.phoneNumber}` 
      : null;

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
          phone: phoneNumber,
        }
      }
    });

    if (error) {
      toast({
        variant: "destructive",
        description: translations.registrationError,
      });
    } else {
      toast({
        description: translations.registrationSuccess,
      });
      onClose();
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{translations.title}</DialogTitle>
          <DialogDescription>
            {translations.loginDescription}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{translations.login}</TabsTrigger>
            <TabsTrigger value="register">{translations.register}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <EmailInput form={loginForm} label={translations.email} />
                <PasswordInput form={loginForm} label={translations.password} />
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
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <Form {...registrationForm}>
              <form onSubmit={registrationForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{translations.firstName}</Label>
                    <Input
                      id="firstName"
                      {...registrationForm.register("firstName")}
                      placeholder={translations.firstNamePlaceholder}
                    />
                    {registrationForm.formState.errors.firstName && (
                      <p className="text-sm text-destructive">
                        {registrationForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{translations.lastName}</Label>
                    <Input
                      id="lastName"
                      {...registrationForm.register("lastName")}
                      placeholder={translations.lastNamePlaceholder}
                    />
                    {registrationForm.formState.errors.lastName && (
                      <p className="text-sm text-destructive">
                        {registrationForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <EmailInput form={registrationForm} label={translations.email} />
                
                <PhoneInputWithCountry
                  label={translations.phoneNumber}
                  countryCode={registrationForm.watch('countryCode') || '+371'}
                  phoneNumber={registrationForm.watch('phoneNumber') || ''}
                  onCountryCodeChange={(code) => registrationForm.setValue('countryCode', code)}
                  onPhoneNumberChange={(number) => registrationForm.setValue('phoneNumber', number)}
                  required={false}
                  placeholder={translations.phoneNumberPlaceholder}
                />
                
                <PasswordInput form={registrationForm} label={translations.password} />
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{translations.confirmPassword}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...registrationForm.register("confirmPassword")}
                    placeholder={translations.confirmPasswordPlaceholder}
                  />
                  {registrationForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {registrationForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? translations.registrationLoading : translations.register}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
