
import React from "react";
import { useLanguage } from "@/features/language";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginTranslations } from "./translations";
import { LoginForm } from "./forms/LoginForm";
import { RegistrationForm } from "./forms/RegistrationForm";
import { Button } from "@/components/ui/button";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export function LoginDialog({ isOpen, onClose, defaultTab = "login" }: LoginDialogProps) {
  const { currentLanguage } = useLanguage();
  const translations = getLoginTranslations(currentLanguage.code);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] border-border bg-background">
        <DialogHeader>
          <DialogTitle className="text-foreground">{translations.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {translations.loginDescription}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              {translations.login}
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              {translations.register}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4 pt-4">
            <LoginForm 
              translations={translations}
              onClose={onClose}
            />
            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
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
          
          <TabsContent value="register" className="space-y-4 pt-4">
            <RegistrationForm 
              translations={translations}
              languageCode={currentLanguage.code}
              onClose={onClose}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
