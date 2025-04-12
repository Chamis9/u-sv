
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
      description: "Izskats un valodas iestatījumi ir veiksmīgi saglabāti",
    });
  };
  
  const onNotificationSubmit = (values: z.infer<typeof notificationFormSchema>) => {
    console.log(values);
    toast({
      description: "Paziņojumu iestatījumi ir veiksmīgi saglabāti",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platformas iestatījumi</h1>
        <p className="text-muted-foreground">Pārvaldiet platformas globālos iestatījumus</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="appearance">Izskats un valoda</TabsTrigger>
          <TabsTrigger value="notifications">Paziņojumi</TabsTrigger>
          <TabsTrigger value="security">Drošība</TabsTrigger>
          <TabsTrigger value="integrations">Integrācijas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Izskats un valoda</CardTitle>
              <CardDescription>
                Pārvaldiet lietotāja saskarnes izskatu un valodu
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
                        <FormLabel>Tēma</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Izvēlēties tēmu" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">
                                  <div className="flex items-center gap-2">
                                    <Sun className="h-4 w-4" />
                                    <span>Gaišā</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="dark">
                                  <div className="flex items-center gap-2">
                                    <Moon className="h-4 w-4" />
                                    <span>Tumšā</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="system">
                                  <div className="flex items-center gap-2">
                                    <span>Sistēmas</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </div>
                        <FormDescription>
                          Izvēlieties vietnes tēmu
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={appearanceForm.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valoda</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Izvēlēties valodu" />
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
                          Izvēlieties administrācijas paneļa valodu
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
                    Atiestatīt
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Saglabāt izmaiņas
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paziņojumu iestatījumi</CardTitle>
              <CardDescription>
                Pārvaldiet, kādus paziņojumus saņemat
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
                          <FormLabel className="text-base">E-pasta paziņojumi</FormLabel>
                          <FormDescription>
                            Ieslēgt vai izslēgt visus e-pasta paziņojumus.
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
                          <FormLabel className="text-base">Administratora paziņojumi</FormLabel>
                          <FormDescription>
                            Saņemt paziņojumus par administratora darbībām.
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
                          <FormLabel className="text-base">Lietotāju reģistrācijas</FormLabel>
                          <FormDescription>
                            Saņemt paziņojumus, kad reģistrējas jauni lietotāji.
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
                          <FormLabel className="text-base">Jaunumu abonementi</FormLabel>
                          <FormDescription>
                            Saņemt paziņojumus par jauniem jaunumu abonentiem.
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
                    Atiestatīt
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Saglabāt izmaiņas
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Drošības iestatījumi</CardTitle>
              <CardDescription>
                Pārvaldiet platformas drošības iestatījumus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Drošības iestatījumi tiks pievienoti drīzumā...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrācijas</CardTitle>
              <CardDescription>
                Pārvaldiet trešo pušu integrācijas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Integrāciju iestatījumi tiks pievienoti drīzumā...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
