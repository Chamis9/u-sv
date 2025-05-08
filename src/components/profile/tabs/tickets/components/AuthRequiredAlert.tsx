
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AuthRequiredAlertProps {
  t: (lvText: string, enText: string) => string;
}

export function AuthRequiredAlert({ t }: AuthRequiredAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{t("Nav pieslēgts", "Not logged in")}</AlertTitle>
      <AlertDescription>
        {t(
          "Lai redzētu savas biļetes, lūdzu pieslēdzieties savā kontā", 
          "Please log in to view your tickets"
        )}
      </AlertDescription>
    </Alert>
  );
}
