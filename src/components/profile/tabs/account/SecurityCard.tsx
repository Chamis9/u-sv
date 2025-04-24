
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/features/language";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { PasswordInput } from "@/components/auth/PasswordInput";

export function SecurityCard() {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.getValues('newPassword') !== form.getValues('confirmPassword')) {
      toast({
        variant: "destructive",
        title: t("Kļūda!", "Error!"),
        description: t(
          "Jaunā parole un apstiprinājuma parole nesakrīt",
          "New password and confirmation password do not match"
        )
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: form.getValues('newPassword')
      });

      if (error) throw error;

      toast({
        title: t("Veiksmīgi!", "Success!"),
        description: t(
          "Jūsu parole ir veiksmīgi atjaunināta",
          "Your password has been successfully updated"
        )
      });
      
      setIsChangingPassword(false);
      form.reset();
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        variant: "destructive",
        title: t("Kļūda!", "Error!"),
        description: t(
          "Neizdevās atjaunināt paroli. Lūdzu, mēģiniet vēlreiz",
          "Failed to update password. Please try again"
        )
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Konta drošība", "Account Security")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isChangingPassword ? (
          <div className="space-y-2">
            <Label>{t("Parole", "Password")}</Label>
            <div className="flex items-center">
              <p className="flex-1">••••••••</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsChangingPassword(true)}
              >
                {t("Mainīt paroli", "Change Password")}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              form={form}
              name="currentPassword"
              label={t("Pašreizējā parole", "Current Password")}
              placeholder={t("Ievadiet pašreizējo paroli", "Enter current password")}
            />
            
            <PasswordInput
              form={form}
              name="newPassword"
              label={t("Jaunā parole", "New Password")}
              placeholder={t("Ievadiet jauno paroli", "Enter new password")}
            />
            
            <PasswordInput
              form={form}
              name="confirmPassword"
              label={t("Apstiprināt jauno paroli", "Confirm New Password")}
              placeholder={t("Apstiprināt jauno paroli", "Confirm new password")}
            />
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {t("Saglabāt", "Save")}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  form.reset();
                }}
                disabled={isLoading}
              >
                {t("Atcelt", "Cancel")}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
