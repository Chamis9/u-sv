
import React from "react";
import { useLanguage } from "@/features/language";

interface AdminLoginStatusProps {
  setupComplete: boolean;
}

export function AdminLoginStatus({ setupComplete }: AdminLoginStatusProps) {
  const { currentLanguage } = useLanguage();
  
  // Translation helper function
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  if (setupComplete) {
    return null;
  }

  return (
    <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
      {t('Supabase autentifikācija pieejama. Lūdzu, izmantojiet administratora kontu, lai pieslēgtos.', 
         'Supabase authentication is available. Please use an admin account to log in.')}
    </div>
  );
}
