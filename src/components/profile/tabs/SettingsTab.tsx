
import React from "react";
import { User } from "@/types/users";
import { useLanguage } from "@/features/language";
import { languages } from "@/features/language";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

interface SettingsTabProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export function SettingsTab({ user, onUserUpdate }: SettingsTabProps) {
  const { currentLanguage, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    
    toast({
      description: checked 
        ? t("Tumšais motīvs ieslēgts", "Dark mode enabled") 
        : t("Gaišais motīvs ieslēgts", "Light mode enabled"),
    });
  };
  
  const handleLanguageChange = (value: string) => {
    const selectedLanguage = languages.find(lang => lang.code === value);
    if (selectedLanguage) {
      setLanguage(selectedLanguage);
      
      toast({
        description: t(
          `Valoda nomainīta uz: ${selectedLanguage.name}`, 
          `Language changed to: ${selectedLanguage.name}`
        ),
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Izskata iestatījumi", "Appearance Settings")}</CardTitle>
          <CardDescription>
            {t("Pielāgojiet aplikācijas izskatu", "Customize how the application looks")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("Tumšais motīvs", "Dark Mode")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("Ieslēdziet tumšo motīvu, lai samazinātu acu slodzi", "Turn on dark mode to reduce eye strain")}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch 
                checked={theme === "dark"}
                onCheckedChange={handleThemeChange}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("Valodas iestatījumi", "Language Settings")}</CardTitle>
          <CardDescription>
            {t("Izvēlieties aplikācijas valodu", "Choose the application language")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            defaultValue={currentLanguage.code}
            onValueChange={handleLanguageChange}
            className="space-y-3"
          >
            {languages.map((language) => (
              <div key={language.code} className="flex items-center space-x-2">
                <RadioGroupItem value={language.code} id={`language-${language.code}`} />
                <Label htmlFor={`language-${language.code}`} className="flex items-center space-x-2">
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("Paziņojumu iestatījumi", "Notification Settings")}</CardTitle>
          <CardDescription>
            {t("Pārvaldiet, kādus paziņojumus vēlaties saņemt", "Manage what notifications you receive")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("E-pasta paziņojumi", "Email Notifications")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("Saņemiet paziņojumus uz e-pastu", "Receive notifications via email")}
              </p>
            </div>
            <Switch defaultChecked={true} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("Mārketinga e-pasti", "Marketing Emails")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("Saņemiet jaunumus un akcijas", "Receive news and promotions")}
              </p>
            </div>
            <Switch defaultChecked={false} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
