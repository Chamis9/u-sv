
import React from "react";
import { useLanguage } from "@/features/language";
import { User } from "@/types/users";

interface ProfileHeaderProps {
  activeTab: string;
  user: User | null;
}

export function ProfileHeader({ activeTab, user }: ProfileHeaderProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const getHeaderTitle = () => {
    switch (activeTab) {
      case "account":
        return t("Mans konts", "My Account");
      case "tickets":
        return t("Manas biļetes", "My Tickets");
      case "payments":
        return t("Mani maksājumi", "My Payments");
      case "settings":
        return t("Iestatījumi", "Settings");
      default:
        return t("Mans profils", "My Profile");
    }
  };
  
  const getHeaderDescription = () => {
    switch (activeTab) {
      case "account":
        return t("Pārvaldiet savu konta informāciju", "Manage your account information");
      case "tickets":
        return t("Apskatiet savas biļetes", "View your tickets");
      case "payments":
        return t("Apskatiet savus maksājumus", "View your payment history");
      case "settings":
        return t("Pielāgojiet savas preferences", "Customize your preferences");
      default:
        return t("Pārvaldiet savu lietotāja profilu", "Manage your user profile");
    }
  };
  
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight">
        {getHeaderTitle()}
      </h1>
      <p className="text-muted-foreground">
        {getHeaderDescription()}
      </p>
    </div>
  );
}
