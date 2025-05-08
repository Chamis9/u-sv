
import React from "react";
import { User } from "@/types/users";
import { useLanguage } from "@/features/language";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface PaymentsTabProps {
  user: User;
}

export function PaymentsTab({ user }: PaymentsTabProps) {
  const { currentLanguage } = useLanguage();
  const t = (lvText: string, enText: string, ruText?: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    if (currentLanguage.code === 'ru') return ruText || enText;
    return enText;
  };
  
  return (
    <Card className="bg-card dark:bg-gray-900">
      <CardHeader>
        <CardTitle>{t("Maksājumu vēsture", "Payment History", "История платежей")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8">
          <CreditCard className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <p className="mt-2 text-lg font-medium">
            {t("Nav maksājumu vēstures", "No payment history", "Нет истории платежей")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t(
              "Jūs vēl neesat veicis nevienu maksājumu", 
              "You haven't made any payments yet",
              "Вы еще не совершали платежей"
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
