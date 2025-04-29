
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/features/language";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  const { currentLanguage } = useLanguage();
  
  // Translate helper
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  return (
    <Button 
      type="submit" 
      disabled={isSubmitting}
      className="w-full"
    >
      {isSubmitting 
        ? t("Pievieno...", "Adding...") 
        : t("Pievienot pasākumu un biļeti", "Add event and ticket")
      }
    </Button>
  );
};
