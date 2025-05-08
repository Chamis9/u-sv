
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
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-2">
          <Label>
            {t("Valoda", "Language")}
          </Label>
          <p className="text-sm text-muted-foreground mb-4">
            {formDescriptionText}
          </p>
          <LanguageSelector />
        </div>
      </CardContent>
    </>
  );
}
