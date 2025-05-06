
import React, { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useLanguage } from "@/features/language";
import { LoginDialog } from "./LoginDialog";
import { UserCircle } from "lucide-react";

interface LoginButtonProps extends Omit<ButtonProps, "onClick"> {
  defaultTab?: "login" | "register";
  showIcon?: boolean;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
}

export function LoginButton({ 
  children, 
  defaultTab = "login",
  showIcon = true,
  variant = "default",
  className,
  ...props 
}: LoginButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string, ruText?: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    if (currentLanguage.code === 'ru') return ruText || enText;
    return enText;
  };
  
  const buttonText = children || t("Pieslēgties", "Login", "Войти");

  return (
    <>
      <Button
        variant={variant}
        className={className}
        onClick={() => setIsOpen(true)}
        {...props}
      >
        {showIcon && <UserCircle className="mr-2 h-4 w-4" />}
        {buttonText}
      </Button>
      
      <LoginDialog 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        defaultTab={defaultTab} 
      />
    </>
  );
}
