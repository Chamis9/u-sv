
import React from "react";
import { AppearanceAndLanguage } from "@/components/shared/AppearanceAndLanguage";
import { useLanguage } from "@/features/language";

export function AppearanceSettings() {
  const { currentLanguage } = useLanguage();
  
  // Translation helper
  const t = (lvText: string, enText: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    return enText;
  };

  return (
    <AppearanceAndLanguage 
      cardTitle={t("Izskats un valoda", "Appearance and Language")}
      cardDescription={t(
        "Pārvaldiet lietotāja saskarnes izskatu un valodu", 
        "Manage the user interface appearance and language"
      )}
      formDescriptionText={t(
        "Izvēlieties administrācijas paneļa valodu", 
        "Choose the admin panel language"
      )}
    />
  );
}
