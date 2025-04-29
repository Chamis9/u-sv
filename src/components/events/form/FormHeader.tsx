
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/features/language";

export const FormHeader = () => {
  const { currentLanguage } = useLanguage();
  
  // Translate helper
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  return (
    <CardHeader>
      <CardTitle>{t("Pievienot pasākumu un biļeti", "Add event and ticket")}</CardTitle>
    </CardHeader>
  );
};
