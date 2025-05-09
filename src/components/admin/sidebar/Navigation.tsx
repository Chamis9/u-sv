
import React from "react";
import { NavItem } from "./NavItem";
import { getNavItems } from "./getNavItems";
import { TranslationObject } from "@/features/language/types";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userCount: number;
  subscriberCount: number;
  adminCount?: number;
  translations: TranslationObject;
}

export const Navigation = ({ 
  activeTab, 
  onTabChange, 
  userCount, 
  subscriberCount, 
  adminCount = 0,
  translations 
}: NavigationProps) => {
  // Log props for debugging
  React.useEffect(() => {
    console.log("Navigation props:", { activeTab, userCount, subscriberCount, adminCount });
  }, [activeTab, userCount, subscriberCount, adminCount]);
  
  const navItems = getNavItems(translations, userCount, subscriberCount, adminCount);
  
  return (
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => (
        <NavItem 
          key={item.id}
          id={item.id}
          icon={item.icon}
          label={item.label}
          badge={item.badge}
          isActive={activeTab === item.id}
          onClick={() => onTabChange(item.id)}
        />
      ))}
    </nav>
  );
};
