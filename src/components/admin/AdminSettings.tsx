
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Save, RefreshCw, Moon, Sun, Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/features/language";
import { languages } from "@/features/language";
import { useTheme } from "@/components/theme/ThemeProvider";

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  language: z.string()
});

const notificationFormSchema = z.object({
  enableEmailNotifications: z.boolean(),
  adminNotifications: z.boolean(),
  userSignupNotifications: z.boolean(),
  newsletterNotifications: z.boolean(),
});

export function AdminSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("appearance");
  const { currentLanguage, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  // Translation helper
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  // Appearance settings form
  const appearanceForm = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: theme as "light" | "dark" | "system",
      language: currentLanguage.code
    },
  });
  
  // Notification settings form
  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      enableEmailNotifications: true,
      adminNotifications: true,
      userSignupNotifications: true,
      newsletterNotifications: false,
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
      description: t("Izskats un valodas iestatījumi ir veiksmīgi saglabāti", "Appearance and language settings saved successfully"),
    });
  };
  
  const onNotificationSubmit = (values: z.infer<typeof notificationFormSchema>) => {
    console.log(values);
    toast({
      description: t("Paziņojumu iestatījumi ir veiksmīgi saglabāti", "Notification settings saved successfully"),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("Platformas iestatījumi", "Platform Settings")}</h1>
        <p className="text-muted-foreground">{t("Pārvaldiet platformas globālos iestatījumus", "Manage platform global settings")}</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="appearance">{t("Izskats un valoda", "Appearance and Language")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("Paziņojumi", "Notifications")}</TabsTrigger>
          <TabsTrigger value="security">{t("Drošība", "Security")}</TabsTrigger>
          <TabsTrigger value="integrations">{t("Integrācijas", "Integrations")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>{t("Izskats un valoda", "Appearance and Language")}</CardTitle>
              <CardDescription>
                {t("Pārvaldiet lietotāja saskarnes izskatu un valodu", "Manage the user interface appearance and language")}
              </CardDescription>
            </CardHeader>
            <Form {...appearanceForm}>
              <form onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={appearanceForm.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Tēma", "Theme")}</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={t("Izvēlēties tēmu", "Select theme")} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">
                                  <div className="flex items-center gap-2">
                                    <Sun className="h-4 w-4" />
                                    <span>{t("Gaišā", "Light")}</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="dark">
                                  <div className="flex items-center gap-2">
                                    <Moon className="h-4 w-4" />
                                    <span>{t("Tumšā", "Dark")}</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="system">
                                  <div className="flex items-center gap-2">
                                    <span>{t("Sistēmas", "System")}</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </div>
                        <FormDescription>
                          {t("Izvēlieties vietnes tēmu", "Choose the site theme")}
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={appearanceForm.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Valoda", "Language")}</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={t("Izvēlēties valodu", "Select language")} />
                              </SelectTrigger>
                              <SelectContent>
                                {languages
                                  .filter(lang => ['lv', 'en'].includes(lang.code))
                                  .map(language => (
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
                        </div>
                        <FormDescription>
                          {t("Izvēlieties administrācijas paneļa valodu", "Choose the admin panel language")}
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => appearanceForm.reset()}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t("Atiestatīt", "Reset")}
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    {t("Saglabāt izmaiņas", "Save changes")}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t("Paziņojumu iestatījumi", "Notification Settings")}</CardTitle>
              <CardDescription>
                {t("Pārvaldiet, kādus paziņojumus saņemat", "Manage what notifications you receive")}
              </CardDescription>
            </CardHeader>
            <Form {...notificationForm}>
              <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={notificationForm.control}
                    name="enableEmailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t("E-pasta paziņojumi", "Email Notifications")}</FormLabel>
                          <FormDescription>
                            {t("Ieslēgt vai izslēgt visus e-pasta paziņojumus.", "Enable or disable all email notifications.")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="adminNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t("Administratora paziņojumi", "Administrator Notifications")}</FormLabel>
                          <FormDescription>
                            {t("Saņemt paziņojumus par administratora darbībām.", "Receive notifications about administrator actions.")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!notificationForm.watch("enableEmailNotifications")}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="userSignupNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t("Lietotāju reģistrācijas", "User Registrations")}</FormLabel>
                          <FormDescription>
                            {t("Saņemt paziņojumus, kad reģistrējas jauni lietotāji.", "Receive notifications when new users register.")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!notificationForm.watch("enableEmailNotifications")}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="newsletterNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t("Jaunumu abonementi", "Newsletter Subscriptions")}</FormLabel>
                          <FormDescription>
                            {t("Saņemt paziņojumus par jauniem jaunumu abonentiem.", "Receive notifications about new newsletter subscribers.")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!notificationForm.watch("enableEmailNotifications")}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => notificationForm.reset()}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t("Atiestatīt", "Reset")}
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    {t("Saglabāt izmaiņas", "Save changes")}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t("Drošības iestatījumi", "Security Settings")}</CardTitle>
              <CardDescription>
                {t("Pārvaldiet platformas drošības iestatījumus", "Manage platform security settings")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t("Drošības iestatījumi tiks pievienoti drīzumā...", "Security settings will be added soon...")}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>{t("Integrācijas", "Integrations")}</CardTitle>
              <CardDescription>
                {t("Pārvaldiet trešo pušu integrācijas", "Manage third-party integrations")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t("Integrāciju iestatījumi tiks pievienoti drīzumā...", "Integration settings will be added soon...")}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

