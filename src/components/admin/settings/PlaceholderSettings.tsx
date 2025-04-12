
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useLanguage } from "@/features/language";

interface PlaceholderSettingsProps {
  type: "security" | "integrations";
}

export function PlaceholderSettings({ type }: PlaceholderSettingsProps) {
  const { currentLanguage } = useLanguage();
  
  // Translation helper
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  const titles = {
    security: t("Drošības iestatījumi", "Security Settings"),
    integrations: t("Integrācijas", "Integrations")
  };
  
  const descriptions = {
    security: t("Pārvaldiet platformas drošības iestatījumus", "Manage platform security settings"),
    integrations: t("Pārvaldiet trešo pušu integrācijas", "Manage third-party integrations")
  };
  
  const messages = {
    security: t("Drošības iestatījumi tiks pievienoti drīzumā...", "Security settings will be added soon..."),
    integrations: t("Integrāciju iestatījumi tiks pievienoti drīzumā...", "Integration settings will be added soon...")
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{titles[type]}</CardTitle>
        <CardDescription>
          {descriptions[type]}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          {messages[type]}
        </p>
      </CardContent>
    </Card>
  );
}
