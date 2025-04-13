
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
import { Moon, Sun, Save, RefreshCw } from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface SettingsTabProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  language: z.string()
});

export function SettingsTab({ user, onUserUpdate }: SettingsTabProps) {
  const { currentLanguage, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const t = (lvText: string, enText: string, ruText?: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    if (currentLanguage.code === 'ru') return ruText || enText;
    return enText;
  };
  
  // Appearance settings form
  const appearanceForm = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: theme as "light" | "dark" | "system",
      language: currentLanguage.code
    },
  });
  
  const onAppearanceSubmit = (values: z.infer<typeof appearanceFormSchema>) => {
    console.log(values);
    setTheme(values.theme);
    const newLanguage = languages.find(lang => lang.code === values.language);
    if (newLanguage) {
      setLanguage(newLanguage);
    }
    toast({
      description: t(
        "Izskats un valodas iestatījumi ir veiksmīgi saglabāti", 
        "Appearance and language settings saved successfully",
        "Настройки внешнего вида и языка успешно сохранены"
      ),
    });
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
          <Form {...appearanceForm}>
            <form onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)}>
              <FormField
                control={appearanceForm.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          const newLanguage = languages.find(lang => lang.code === value);
                          if (newLanguage) {
                            setLanguage(newLanguage);
                            toast({
                              description: t(
                                `Valoda nomainīta uz: ${newLanguage.name}`, 
                                `Language changed to: ${newLanguage.name}`,
                                `Язык изменен на: ${newLanguage.name}`
                              ),
                            });
                          }
                        }} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("Izvēlēties valodu", "Select language", "Выбрать язык")} />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map(language => (
                            <SelectItem key={language.code} value={language.code}>
                              <div className="flex items-center gap-2">
                                <span>{language.flag}</span>
                                <span>{language.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      {t(
                        "Izvēlieties profila valodu", 
                        "Choose your profile language",
                        "Выберите язык профиля"
                      )}
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <div className="mt-6 flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => appearanceForm.reset()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t("Atiestatīt", "Reset", "Сбросить")}
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {t("Saglabāt izmaiņas", "Save changes", "Сохранить изменения")}
                </Button>
              </div>
            </form>
          </Form>
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
