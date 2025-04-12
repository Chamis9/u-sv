
import React from "react";
import { LucideIcon, Home, Users, Mail, Settings, IconNode } from "lucide-react";
import { TranslationObject } from "@/features/language/types";

// Define an interface for nav items
interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

// Map of tab IDs to their respective Lucide icons
const iconMap: Record<string, LucideIcon> = {
  dashboard: Home,
  users: Users,
  subscribers: Mail,
  settings: Settings,
};

/**
 * Gets translated label for a navigation item
 * @param id The ID of the navigation item
 * @param translations The translations object
 * @param fallback Fallback text if translation is not available
 * @returns The translated label
 */
const getTranslatedLabel = (id: string, translations: TranslationObject, fallback: string): string => {
  if (!translations?.admin?.tabs) return fallback;
  
  const tabKey = id as keyof typeof translations.admin.tabs;
  return translations.admin.tabs[tabKey] || fallback;
};

/**
 * Gets the icon component for a navigation item
 * @param id The ID of the navigation item
 * @returns React component with the appropriate icon
 */
const getIconComponent = (id: string): React.ReactNode => {
  const IconComponent = iconMap[id] || Home; // Default to Home if no icon found
  return <IconComponent className="mr-2 h-4 w-4" />;
};

/**
 * Generates navigation items based on translations and badge counts
 * @param translations Translation object for internationalization
 * @param userCount Number of users for badge display
 * @param subscriberCount Number of subscribers for badge display
 * @returns Array of navigation items
 */
export function getNavItems(translations: TranslationObject, userCount: number, subscriberCount: number): NavItem[] {
  const items: NavItem[] = [
    {
      id: "dashboard",
      icon: getIconComponent("dashboard"),
      label: getTranslatedLabel("dashboard", translations, 'Dashboard')
    },
    {
      id: "users",
      icon: getIconComponent("users"),
      label: getTranslatedLabel("users", translations, 'Users'),
      badge: userCount
    },
    {
      id: "subscribers",
      icon: getIconComponent("subscribers"),
      label: getTranslatedLabel("subscribers", translations, 'Subscribers'),
      badge: subscriberCount
    },
    {
      id: "settings",
      icon: getIconComponent("settings"),
      label: getTranslatedLabel("settings", translations, 'Settings')
    }
  ];

  return items;
}
