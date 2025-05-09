
import React, { useState } from "react";
import { UserCircle } from "lucide-react";
import { LoginButton } from "@/components/auth/LoginButton";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useLanguage } from "@/features/language";

interface ProfileAuthGuardProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isLoading?: boolean;
  requireAdmin?: boolean; // New prop to check for admin status
  isAdmin?: boolean; // New prop to pass admin status
}

export function ProfileAuthGuard({ 
  children, 
  isAuthenticated, 
  isLoading = false,
  requireAdmin = false,
  isAdmin = false
}: ProfileAuthGuardProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string, ruText?: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    if (currentLanguage.code === 'ru') return ruText || enText;
    return enText;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          {t("Pieeja liegta", "Access denied", "Доступ запрещен")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t(
            "Lai piekļūtu šai lapai, lūdzu, piesakieties savā kontā", 
            "Please sign in to access this page", 
            "Пожалуйста, войдите в систему для доступа к этой странице"
          )}
        </p>
        <LoginButton variant="default" className="gap-2" />
      </div>
    );
  }

  // If admin privileges are required but user is not an admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          {t("Administratora tiesības nepieciešamas", "Administrator privileges required", "Требуются права администратора")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t(
            "Jums nav pietiekamas tiesības, lai piekļūtu šai lapai", 
            "You don't have sufficient privileges to access this page", 
            "У вас недостаточно прав для доступа к этой странице"
          )}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
