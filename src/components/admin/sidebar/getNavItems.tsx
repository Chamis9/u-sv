
import React from "react";
import { Home, Users, Mail, Settings } from "lucide-react";
import { TranslationObject } from "@/features/language/types";

export function getNavItems(translations: TranslationObject, userCount: number, subscriberCount: number) {
  return [
    {
      id: "dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
      label: translations.admin?.tabs?.dashboard || 'Dashboard'
    },
    {
      id: "users",
      icon: <Users className="mr-2 h-4 w-4" />,
      label: translations.admin?.tabs?.users || 'Users',
      badge: userCount
    },
    {
      id: "subscribers",
      icon: <Mail className="mr-2 h-4 w-4" />,
      label: translations.admin?.tabs?.subscribers || 'Subscribers',
      badge: subscriberCount
    },
    {
      id: "settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      label: translations.admin?.tabs?.settings || 'Settings'
    }
  ];
}
