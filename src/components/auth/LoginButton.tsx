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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

interface LoginButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  defaultTab?: "login" | "register";
  onClose?: () => void;
}

export function LoginButton({ className, defaultTab = "login", onClose, ...props }: LoginButtonProps) {
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
        onClose();
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

  return (
    <>
      <Button
        variant="default"
        onClick={() => setOpen(true)}
        className={cn(className)}
        {...props}
      >
        {props.children || translations.login}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent style={{ maxWidth: '400px' }} onFocus={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}>
          <Card>
            <CardHeader>
              <AlertDialogHeader>
                <CardTitle>{translations.title}</CardTitle>
                <CardDescription>
                  {translations.loginDescription}
                </CardDescription>
              </AlertDialogHeader>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="login">{translations.login}</TabsTrigger>
                  <TabsTrigger value="register">{translations.register}</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm translations={translations} languageCode={languageCode} onClose={() => setOpen(false)} />
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <CardFooter className="justify-center">
                    <Button variant="secondary" disabled>
                      Google
                    </Button>
                  </CardFooter>
                </TabsContent>
                <TabsContent value="register">
                  <RegistrationForm translations={translations} languageCode={languageCode} onClose={() => setOpen(false)} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
