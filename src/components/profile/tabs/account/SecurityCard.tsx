
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/features/language";
import { AlertTriangle } from "lucide-react";

export function SecurityCard() {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  return (
    <Card className="bg-card dark:bg-gray-900">
      <CardHeader>
        <CardTitle>{t("Drošība", "Security")}</CardTitle>
        <CardDescription>
          {t(
            "Pārvaldiet sava konta drošības iestatījumus", 
            "Manage your account security settings"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-amber-50 dark:bg-amber-950/50 p-4 border border-amber-200 dark:border-amber-900">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                {t("Drošības iestatījumi", "Security Settings")}
              </h3>
              <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                <p>
                  {t(
                    "Drošības iestatījumu pārvaldība pagaidām nav pieejama.", 
                    "Security settings management is not available at this time."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">
            {t("Parole", "Password")}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t(
              "Mainiet paroli, lai uzlabotu konta drošību", 
              "Change your password to improve account security"
            )}
          </p>
          <Button variant="outline">
            {t("Mainīt paroli", "Change Password")}
          </Button>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-2">
            {t("Divpakāpju autentifikācija", "Two-Factor Authentication")}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t(
              "Uzlabojiet konta drošību ar divpakāpju autentifikāciju", 
              "Enhance account security with two-factor authentication"
            )}
          </p>
          <Button variant="outline">
            {t("Iestatīt 2FA", "Set up 2FA")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
