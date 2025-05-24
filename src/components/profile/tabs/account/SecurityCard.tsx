import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/features/language";
import { Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Current password must be at least 6 characters.",
  }),
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

export function SecurityCard() {
  const { currentLanguage } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof passwordFormSchema>) => {
    setIsLoading(true);
    
    try {
      // Update password via Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });
      
      if (error) {
        console.error("Error updating password:", error);
        toast.error(t(
          "Kļūda mainot paroli. Lūdzu, mēģiniet vēlreiz.",
          "Error changing password. Please try again."
        ));
        return;
      }
      
      // Success
      toast.success(t(
        "Parole veiksmīgi nomainīta!",
        "Password changed successfully!"
      ));
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      form.reset();
      
    } catch (error) {
      console.error("Error:", error);
      toast.error(t(
        "Kļūda mainot paroli. Lūdzu, mēģiniet vēlreiz.",
        "Error changing password. Please try again."
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="bg-card dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            {t("Drošība", "Security")}
          </CardTitle>
          <CardDescription className="text-gray-700 dark:text-gray-300 font-medium">
            {t(
              "Pārvaldiet sava konta drošības iestatījumus", 
              "Manage your account security settings"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
              {t("Parole", "Password")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
              {t(
                "Mainiet paroli, lai uzlabotu konta drošību", 
                "Change your password to improve account security"
              )}
            </p>
            <Button 
              variant="orange"
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center"
            >
              <Key className="mr-2 h-4 w-4" />
              {t("Mainīt paroli", "Change Password")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {t("Mainīt paroli", "Change Password")}
            </DialogTitle>
            <DialogDescription className="text-gray-700 dark:text-gray-300">
              {t(
                "Ievadiet savu pašreizējo paroli un jauno paroli zemāk.",
                "Enter your current password and your new password below."
              )}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-gray-100">
                      {t("Pašreizējā parole", "Current Password")}
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-gray-100">
                      {t("Jaunā parole", "New Password")}
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-gray-100">
                      {t("Apstiprināt jauno paroli", "Confirm New Password")}
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  {t("Atcelt", "Cancel")}
                </Button>
                <Button type="submit" variant="orange" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t("Saglabāt", "Save")}
                    </span>
                  ) : t("Saglabāt", "Save")}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
