
import React from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeModeToggle } from "@/components/auth/theme/ThemeModeToggle";
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
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">{t("Motīvs", "Theme")}</Label>
            <ThemeModeToggle />
          </div>
          <p className="text-sm text-muted-foreground">
            {t(
              "Pārslēdzieties starp gaišo un tumšo motīvu",
              "Toggle between light and dark mode"
            )}
          </p>
        </div>
        
        <div className="space-y-2 border-t pt-6">
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
