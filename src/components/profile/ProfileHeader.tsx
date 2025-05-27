
import React from "react";
import { useLanguage } from "@/features/language";
import { User } from "@/types/users";

interface ProfileHeaderProps {
  activeTab: string;
  user: User | null;
}

export function ProfileHeader({ activeTab, user }: ProfileHeaderProps) {
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
  
  const getHeaderTitle = () => {
    switch (activeTab) {
      case "account":
        return t("Mans konts", "My Account", "Mano paskyra", "Minu konto");
      case "tickets":
        return t("Manas biļetes", "My Tickets", "Mano bilietai", "Minu piletid");
      case "payments":
        return t("Mani maksājumi", "My Payments", "Mano mokėjimai", "Minu maksed");
      case "settings":
        return t("Iestatījumi", "Settings", "Nustatymai", "Seaded");
      default:
        return t("Mans profils", "My Profile", "Mano profilis", "Minu profiil");
    }
  };
  
  const getHeaderDescription = () => {
    switch (activeTab) {
      case "account":
        return t("Pārvaldiet savu konta informāciju", "Manage your account information", "Tvarkykite savo paskyros informaciją", "Hallake oma konto teavet");
      case "tickets":
        return t("Apskatiet savas biļetes", "View your tickets", "Peržiūrėkite savo bilietus", "Vaadake oma pileteid");
      case "payments":
        return t("Apskatiet savus maksājumus", "View your payment history", "Peržiūrėkite savo mokėjimų istoriją", "Vaadake oma maksete ajalugu");
      case "settings":
        return t("Pielāgojiet savas preferences", "Customize your preferences", "Pritaikykite savo nuostatas", "Kohandage oma eelistusi");
      default:
        return t("Pārvaldiet savu lietotāja profilu", "Manage your user profile", "Tvarkykite savo vartotojo profilį", "Hallake oma kasutajaprofiili");
    }
  };
  
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {getHeaderTitle()}
      </h1>
      <p className="text-gray-700 dark:text-gray-300 font-medium mt-1">
        {getHeaderDescription()}
      </p>
    </div>
  );
}
