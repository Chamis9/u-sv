
import React from "react";
import { User } from "@/types/users";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/features/language";

interface PaymentsTabProps {
  user: User;
}

export function PaymentsTab({ user }: PaymentsTabProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string, ltText: string, eeText: string) => {
    switch (currentLanguage.code) {
      case 'lv': return lvText;
      case 'en': return enText;
      case 'lt': return ltText;
      case 'et':
      case 'ee': return eeText;
      default: return lvText;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            {t("Maksājumu vēsture", "Payment History", "Mokėjimų istorija", "Maksete ajalugu")}
          </CardTitle>
          <CardDescription className="text-gray-700 dark:text-gray-300 font-medium">
            {t(
              "Apskatiet savus iepriekšējos maksājumus", 
              "View your previous payments",
              "Peržiūrėkite savo ankstesnius mokėjimus",
              "Vaadake oma varasemaid makseid"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t("Nav maksājumu vēstures", "No payment history", "Nėra mokėjimų istorijos", "Maksete ajalugu puudub")}
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              {t(
                "Jūsu maksājumi tiks rādīti šeit pēc to veikšanas",
                "Your payments will appear here after they are made",
                "Jūsų mokėjimai bus rodomi čia po to, kai jie bus atlikti",
                "Teie maksed kuvatakse siin pärast nende tegemist"
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
