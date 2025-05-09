
import React, { useState } from "react";
import { UserCircle } from "lucide-react";
import { LoginButton } from "@/components/auth/LoginButton";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useLanguage } from "@/features/language";

interface ProfileAuthGuardProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isLoading?: boolean;
  requiredRole?: string;
  userRole?: string;
}

export function ProfileAuthGuard({ 
  children, 
  isAuthenticated, 
  isLoading = false,
  requiredRole,
  userRole = 'user'
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

  // Check role-based access if a required role is specified
  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          {t("Pieeja liegta", "Access denied", "Доступ запрещен")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t(
            "Jums nav nepieciešamo tiesību, lai piekļūtu šai lapai", 
            "You don't have the required permissions to access this page", 
            "У вас нет необходимых разрешений для доступа к этой странице"
          )}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
