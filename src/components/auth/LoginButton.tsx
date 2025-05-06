
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/features/language";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { LoginForm } from "./forms/LoginForm";
import { RegistrationForm } from "./forms/RegistrationForm";
import { useSearchParams } from "react-router-dom";
import { getLoginTranslations } from "./translations";
import { useAuth } from "@/contexts/AuthContext";
import { ButtonProps } from "@/components/ui/button";

interface LoginButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  defaultTab?: "login" | "register";
  onClose?: () => void;
  variant?: string;
  showIcon?: boolean;
}

export function LoginButton({ className, defaultTab = "login", onClose, variant = "default", showIcon = true, ...props }: LoginButtonProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  const translations = getLoginTranslations(currentLanguage.code);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const { login } = useAuth();
  const languageCode = currentLanguage.code;

  React.useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "register") {
      setOpen(true);
    }
  }, [searchParams]);

  const handleLogin = async (values: any) => {
    console.log('Attempting login with:', values.email);
    setIsLoggingIn(true);
    
    try {
      const success = await login(values.email, values.password);
      
      if (success) {
        console.log('Login successful');
        toast({
          description: languageCode === 'lv' ? 'Veiksmīga pieslēgšanās' : 'Successfully logged in'
        });
        onClose?.();
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive", 
        description: translations.invalidCredentials
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <>
      <Button
        variant={variant as any}
        onClick={() => setOpen(true)}
        className={cn(className)}
        {...props}
      >
        {props.children || translations.login}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <CardTitle>{translations.title}</CardTitle>
            <CardDescription>
              {translations.loginDescription}
            </CardDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{translations.login}</TabsTrigger>
                <TabsTrigger value="register">{translations.register}</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm translations={translations} onClose={handleCloseModal} />
                <div className="relative mt-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <Button variant="secondary" disabled>
                    Google
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="register">
                <RegistrationForm translations={translations} languageCode={languageCode} onClose={handleCloseModal} />
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
