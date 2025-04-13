
import React from "react";
import { useLanguage } from "@/features/language";
import { AlertCircle } from "lucide-react";

export function AdminAuthError() {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <h3 className="font-medium">{t('Autentifikācijas kļūda', 'Authentication Error')}</h3>
      </div>
      <p className="mt-2 text-sm">
        {t('Jums jāpieslēdzas ar administratora kontu, lai piekļūtu administratoriem.', 
          'You need to sign in with an administrator account to access administrators.')}
      </p>
    </div>
  );
}
