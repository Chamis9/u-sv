
import React, { memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Users, Mail, Settings, Shield } from "lucide-react";
import { useLanguage } from "@/features/language";

interface AdminMobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminMobileNav = memo(function AdminMobileNav({ activeTab, onTabChange }: AdminMobileNavProps) {
  const { translations } = useLanguage();
  
  const icons = {
    dashboard: <Home className="h-5 w-5" />,
    users: <Users className="h-5 w-5" />,
    admins: <Shield className="h-5 w-5" />,
    subscribers: <Mail className="h-5 w-5" />,
    settings: <Settings className="h-5 w-5" />
  };
  
  const titles = {
    dashboard: translations.admin?.tabs?.dashboard || 'Dashboard',
    users: translations.admin?.tabs?.users || 'Users',
    admins: translations.admin?.tabs?.admins || 'Administrators',
    subscribers: translations.admin?.tabs?.subscribers || 'Subscribers',
    settings: translations.admin?.tabs?.settings || 'Settings'
  };
  
  return (
    <div className="md:hidden mb-6">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="w-full grid grid-cols-5">
          {Object.entries(icons).map(([key, icon]) => (
            <TabsTrigger key={key} value={key} title={titles[key as keyof typeof titles]}>
              {icon}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
});
