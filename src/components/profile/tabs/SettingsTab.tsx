
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
  
  const t = (lvText: string, enText: string, ruText?: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    if (currentLanguage.code === 'ru') return ruText || enText;
    return enText;
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-card dark:bg-gray-900">
        <AppearanceAndLanguage 
          cardTitle={t("Valodas iestatījumi", "Language Settings", "Настройки языка")}
          cardDescription={t(
            "Izvēlieties aplikācijas valodu", 
            "Choose your application language", 
            "Выберите язык приложения"
          )}
          formDescriptionText={t(
            "Izvēlieties profila valodu", 
            "Choose your profile language",
            "Выберите язык профиля"
          )}
        />
      </Card>
    </div>
  );
}
