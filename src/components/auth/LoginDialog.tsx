
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
import { loginFormTranslations, registrationFormTranslations } from "./translations";
import { LoginForm } from "./forms/LoginForm";
import { RegistrationForm } from "./forms/RegistrationForm";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export function LoginDialog({ isOpen, onClose, defaultTab = "login" }: LoginDialogProps) {
  const { currentLanguage } = useLanguage();
  const translations = loginFormTranslations[currentLanguage.code] || loginFormTranslations.en;
  const regTranslations = registrationFormTranslations[currentLanguage.code] || registrationFormTranslations.en;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{translations.login}</DialogTitle>
          <DialogDescription>
            {translations.email}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{translations.login}</TabsTrigger>
            <TabsTrigger value="register">{regTranslations.register}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <LoginForm 
              translations={translations}
              onClose={onClose}
            />
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <RegistrationForm 
              translations={regTranslations}
              onClose={onClose}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
