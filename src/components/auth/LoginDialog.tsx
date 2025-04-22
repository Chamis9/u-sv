
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/features/language";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { loginFormSchema, type LoginFormData } from "./schema";
import { getLoginTranslations } from "./translations";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const translations = getLoginTranslations(currentLanguage.code);

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

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{translations.title}</DrawerTitle>
            <DrawerDescription>
              {translations.loginDescription}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
