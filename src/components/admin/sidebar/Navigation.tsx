
import React from "react";
import { TranslationObject } from "@/features/language/types";
import { Button } from "@/components/ui/button";
import { NavItem } from "./NavItem";
import { getNavItems } from "./getNavItems";
import { LogoutButton } from "../sidebar/LogoutButton";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userCount?: number;
  adminCount?: number;
  subscriberCount?: number;
  translations: TranslationObject;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  userCount = 0,
  adminCount = 0,
  subscriberCount = 0,
  translations,
}) => {
  const { logout, userRole } = useAuth();
  
  const navItems = getNavItems({
    translations,
    userCount,
    adminCount,
    subscriberCount,
  });

  const handleLogout = async () => {
    try {
      await logout();
      // The page will be redirected in the logout function
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex flex-col justify-between h-[calc(100vh-64px)]">
      <div className="p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              onClick={() => onTabChange(item.id)}
            />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {translations.admin?.currentUser || "Current user"}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {localStorage.getItem('admin_email') || "Administrator"}
            </span>
            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs font-medium px-2 py-0.5 rounded">
              {userRole || "User"}
            </span>
          </div>
        </div>
        
        <LogoutButton
          logoutText={translations.admin?.logout || "Sign Out"}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
};
