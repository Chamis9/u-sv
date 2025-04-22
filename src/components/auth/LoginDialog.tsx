
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
import { Separator } from "@/components/ui/separator";
import { loginFormSchema, type LoginFormData } from "./schema";
import { getLoginTranslations } from "./translations";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { Facebook, Mail } from "lucide-react";

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

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'smartid') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error) {
      toast({
        variant: "destructive",
        description: translations.loginError,
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
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSocialLogin('google')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Gmail
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSocialLogin('facebook')}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {translations.orContinueWith}
                </span>
              </div>
            </div>

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

            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => handleSocialLogin('smartid')}
            >
              Smart-ID
            </Button>
          </TabsContent>
          
          <TabsContent value="register">
            <div className="py-4">
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => window.location.href = '/registration'}
              >
                {translations.register}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
