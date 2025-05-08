
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
      <DialogContent className="sm:max-w-[425px] bg-teal-600 border border-cream/30 text-cream">
        <DialogHeader>
          <DialogTitle className="text-cream">{translations.title}</DialogTitle>
          <DialogDescription className="text-cream/80">
            {translations.loginDescription}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-teal-700">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-cream text-cream/70"
            >
              {translations.login}
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-cream text-cream/70"
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
                <span className="w-full border-t border-cream/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-teal-600 px-2 text-cream/70">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button variant="secondary" disabled className="bg-amber text-teal-500">
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
