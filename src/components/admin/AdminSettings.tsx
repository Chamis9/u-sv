
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
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
import { Save, RefreshCw } from "lucide-react";

const generalFormSchema = z.object({
  siteName: z.string().min(2, {
    message: "Vietnes nosaukumam jābūt vismaz 2 simboliem.",
  }),
  siteDescription: z.string().min(10, {
    message: "Vietnes aprakstam jābūt vismaz 10 simboliem.",
  }),
  contactEmail: z.string().email({
    message: "Lūdzu, ievadiet derīgu e-pasta adresi.",
  }),
});

const notificationFormSchema = z.object({
  enableEmailNotifications: z.boolean(),
  adminNotifications: z.boolean(),
  userSignupNotifications: z.boolean(),
  newsletterNotifications: z.boolean(),
});

export function AdminSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // General settings form
  const generalForm = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      siteName: "netieku.es",
      siteDescription: "Platforma biļešu pārdošanai un pasākumu organizēšanai",
      contactEmail: "info@netieku.es",
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
  
  const onGeneralSubmit = (values: z.infer<typeof generalFormSchema>) => {
    console.log(values);
    toast({
      description: "Vispārīgie iestatījumi ir veiksmīgi saglabāti",
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
          <TabsTrigger value="general">Vispārīgi</TabsTrigger>
          <TabsTrigger value="notifications">Paziņojumi</TabsTrigger>
          <TabsTrigger value="security">Drošība</TabsTrigger>
          <TabsTrigger value="integrations">Integrācijas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Vispārīgie iestatījumi</CardTitle>
              <CardDescription>
                Pārvaldiet platformas pamatiestatījumus
              </CardDescription>
            </CardHeader>
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={generalForm.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vietnes nosaukums</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Šis ir jūsu vietnes publiskais nosaukums.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vietnes apraksts</FormLabel>
                        <FormControl>
                          <Textarea rows={3} {...field} />
                        </FormControl>
                        <FormDescription>
                          Īss vietnes apraksts, kas tiek izmantots meklēšanas rezultātos.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kontakta e-pasts</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormDescription>
                          Šis e-pasts tiks izmantots platformas paziņojumiem.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => generalForm.reset()}
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
