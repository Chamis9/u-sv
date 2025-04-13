
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
  
  const t = (lvText: string, enText: string, ruText?: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    if (currentLanguage.code === 'ru') return ruText || enText;
    return enText;
  };
  
  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    
    toast({
      description: checked 
        ? t("Tumšais motīvs ieslēgts", "Dark mode enabled", "Тёмный режим включен") 
        : t("Gaišais motīvs ieslēgts", "Light mode enabled", "Светлый режим включен"),
    });
  };
  
  const handleLanguageChange = (value: string) => {
    const selectedLanguage = languages.find(lang => lang.code === value);
    if (selectedLanguage) {
      setLanguage(selectedLanguage);
      
      toast({
        description: t(
          `Valoda nomainīta uz: ${selectedLanguage.name}`, 
          `Language changed to: ${selectedLanguage.name}`,
          `Язык изменен на: ${selectedLanguage.name}`
        ),
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Izskata iestatījumi", "Appearance Settings", "Настройки внешнего вида")}</CardTitle>
          <CardDescription>
            {t("Pielāgojiet aplikācijas izskatu", "Customize how the application looks", "Настройте внешний вид приложения")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("Tumšais motīvs", "Dark Mode", "Тёмный режим")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("Ieslēdziet tumšo motīvu, lai samazinātu acu slodzi", "Turn on dark mode to reduce eye strain", "Включите тёмный режим, чтобы уменьшить нагрузку на глаза")}
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
          <CardTitle>{t("Valodas iestatījumi", "Language Settings", "Языковые настройки")}</CardTitle>
          <CardDescription>
            {t("Izvēlieties aplikācijas valodu", "Choose the application language", "Выберите язык приложения")}
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
          <CardTitle>{t("Paziņojumu iestatījumi", "Notification Settings", "Настройки уведомлений")}</CardTitle>
          <CardDescription>
            {t("Pārvaldiet, kādus paziņojumus vēlaties saņemt", "Manage what notifications you receive", "Управляйте получаемыми уведомлениями")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("E-pasta paziņojumi", "Email Notifications", "Уведомления по электронной почте")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("Saņemiet paziņojumus uz e-pastu", "Receive notifications via email", "Получайте уведомления по электронной почте")}
              </p>
            </div>
            <Switch defaultChecked={true} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("Mārketinga e-pasti", "Marketing Emails", "Маркетинговые сообщения")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("Saņemiet jaunumus un akcijas", "Receive news and promotions", "Получайте новости и акции")}
              </p>
            </div>
            <Switch defaultChecked={false} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
