
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useLanguage } from "@/features/language";
import { SecurityCardContent } from "./security/SecurityCardContent";
import { PasswordChangeDialog } from "./security/PasswordChangeDialog";

export function SecurityCard() {
  const { currentLanguage } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;

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
          <SecurityCardContent 
            onChangePassword={() => setIsDialogOpen(true)}
            t={t}
          />
        </CardContent>
      </Card>

      <PasswordChangeDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        t={t}
      />
    </>
  );
}
