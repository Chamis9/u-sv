
import React from "react";
import { User } from "@/types/users";
import { AppearanceAndLanguage } from "@/components/shared/AppearanceAndLanguage";
import { useLanguage } from "@/features/language";
import { Card } from "@/components/ui/card";

interface SettingsTabProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export function SettingsTab({ user, onUserUpdate }: SettingsTabProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string, ltText: string, eeText: string) => {
    switch (currentLanguage.code) {
      case 'lv': return lvText;
      case 'en': return enText;
      case 'lt': return ltText;
      case 'et':
      case 'ee': return eeText;
      default: return lvText;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-card dark:bg-gray-900">
        <AppearanceAndLanguage 
          cardTitle={t("Valodas iestatījumi", "Language Settings", "Kalbos nustatymai", "Keele seaded")}
          cardDescription={t(
            "Izvēlieties aplikācijas valodu", 
            "Choose your application language",
            "Pasirinkite programos kalbą",
            "Valige rakenduse keel"
          )}
          formDescriptionText={t(
            "Izvēlieties profila valodu", 
            "Choose your profile language",
            "Pasirinkite profilio kalbą",
            "Valige oma profiili keel"
          )}
        />
      </Card>
    </div>
  );
}
