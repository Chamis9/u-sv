
import React from "react";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";

interface SecurityCardContentProps {
  onChangePassword: () => void;
  t: (lvText: string, enText: string, ltText: string, eeText: string) => string;
}

export function SecurityCardContent({ onChangePassword, t }: SecurityCardContentProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
        {t("Parole", "Password", "Slaptažodis", "Parool")}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
        {t(
          "Mainiet paroli, lai uzlabotu konta drošību", 
          "Change your password to improve account security",
          "Pakeiskite slaptažodį, kad pagerėtų paskyros saugumas",
          "Muutke parool, et parandada konto turvalisust"
        )}
      </p>
      <Button 
        variant="orange"
        onClick={onChangePassword}
        className="flex items-center"
      >
        <Key className="mr-2 h-4 w-4" />
        {t("Mainīt paroli", "Change Password", "Keisti slaptažodį", "Muuda parooli")}
      </Button>
    </div>
  );
}
