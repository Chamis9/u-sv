
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/features/language";

export function SecurityCard() {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Konta drošība", "Account Security")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t("Parole", "Password")}</Label>
          <div className="flex items-center">
            <p className="flex-1">••••••••</p>
            <Button variant="outline" size="sm">{t("Mainīt paroli", "Change Password")}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
