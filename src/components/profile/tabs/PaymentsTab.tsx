
import React from "react";
import { User } from "@/types/users";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/features/language";

interface PaymentsTabProps {
  user: User;
}

export function PaymentsTab({ user }: PaymentsTabProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    return enText;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            {t("Maksājumu vēsture", "Payment History")}
          </CardTitle>
          <CardDescription className="text-gray-700 dark:text-gray-300 font-medium">
            {t(
              "Apskatiet savus iepriekšējos maksājumus", 
              "View your previous payments"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t("Nav maksājumu vēstures", "No payment history")}
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              {t(
                "Jūsu maksājumi tiks rādīti šeit pēc to veikšanas",
                "Your payments will appear here after they are made"
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
