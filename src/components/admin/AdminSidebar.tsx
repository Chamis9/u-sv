
import React, { memo } from "react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutButton } from "./sidebar/LogoutButton";
import { Navigation } from "./sidebar/Navigation";
import { useSubscriberCount } from "./sidebar/useSubscriberCount";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userCount?: number;
  subscriberCount?: number;
}

export const AdminSidebar = memo(function AdminSidebar({ 
  activeTab, 
  onTabChange, 
  userCount = 0, 
  subscriberCount: initialSubscriberCount = 0 
}: AdminSidebarProps) {
  const { translations } = useLanguage();
  const { logout } = useAuth();
  const subscriberCount = useSubscriberCount(initialSubscriberCount);

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold">{translations.admin?.title || 'Administrator Panel'}</h2>
      </div>
      
      <Navigation 
        activeTab={activeTab}
        onTabChange={onTabChange}
        userCount={userCount}
        subscriberCount={subscriberCount}
        translations={translations}
      />
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <LogoutButton 
          logoutText={translations.admin?.logout || 'Logout'} 
          onLogout={logout} 
        />
      </div>
    </aside>
  );
});
