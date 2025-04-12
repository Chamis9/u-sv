
import React from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Moon, Sun } from "lucide-react";
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

export function AppearanceSettings() {
  const { toast } = useToast();
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

  return (
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
  );
}
