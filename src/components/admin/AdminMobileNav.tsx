
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Users, Mail, Settings } from "lucide-react";
import { useLanguage } from "@/features/language";

interface AdminMobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminMobileNav({ activeTab, onTabChange }: AdminMobileNavProps) {
  const { currentLanguage } = useLanguage();
  
  // Translation helper
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  return (
    <div className="md:hidden mb-6">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="dashboard" title={t('Pārskats', 'Dashboard')}>
            <Home className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="users" title={t('Lietotāji', 'Users')}>
            <Users className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="subscribers" title={t('Abonenti', 'Subscribers')}>
            <Mail className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="settings" title={t('Iestatījumi', 'Settings')}>
            <Settings className="h-5 w-5" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
