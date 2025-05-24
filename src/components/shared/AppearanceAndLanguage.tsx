
import React from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/features/language";
import { LanguageSelector } from "@/components/LanguageSelector";

interface AppearanceAndLanguageProps {
  cardTitle: string;
  cardDescription: string;
  formDescriptionText: string;
}

export function AppearanceAndLanguage({
  cardTitle,
  cardDescription,
  formDescriptionText
}: AppearanceAndLanguageProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  return (
    <>
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">{cardTitle}</CardTitle>
        <CardDescription className="text-gray-700 dark:text-gray-300 font-medium">{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-2">
          <Label className="text-gray-900 dark:text-white font-medium">
            {t("Valoda", "Language")}
          </Label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {formDescriptionText}
          </p>
          <LanguageSelector />
        </div>
      </CardContent>
    </>
  );
}
