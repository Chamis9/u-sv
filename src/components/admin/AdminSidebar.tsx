
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Settings, Mail, Home, LogOut 
} from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userCount?: number;
  subscriberCount?: number;
}

export function AdminSidebar({ 
  activeTab, 
  onTabChange, 
  userCount = 0, 
  subscriberCount = 0 
}: AdminSidebarProps) {
  const { currentLanguage } = useLanguage();
  const { logout } = useAuth();
  
  // Translation helper
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold">{t('Administratora panelis', 'Administrator Panel')}</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <Button 
          variant={activeTab === "dashboard" ? "default" : "ghost"} 
          className="w-full justify-start"
          onClick={() => onTabChange("dashboard")}
        >
          <Home className="mr-2 h-4 w-4" /> {t('Pārskats', 'Dashboard')}
        </Button>
        
        <Button 
          variant={activeTab === "users" ? "default" : "ghost"} 
          className="w-full justify-start"
          onClick={() => onTabChange("users")}
        >
          <Users className="mr-2 h-4 w-4" /> {t('Lietotāji', 'Users')}
          <Badge className="ml-auto" variant="outline">{userCount}</Badge>
        </Button>
        
        <Button 
          variant={activeTab === "subscribers" ? "default" : "ghost"} 
          className="w-full justify-start"
          onClick={() => onTabChange("subscribers")}
        >
          <Mail className="mr-2 h-4 w-4" /> {t('Abonenti', 'Subscribers')}
          <Badge className="ml-auto" variant="outline">{subscriberCount}</Badge>
        </Button>
        
        <Button 
          variant={activeTab === "settings" ? "default" : "ghost"} 
          className="w-full justify-start"
          onClick={() => onTabChange("settings")}
        >
          <Settings className="mr-2 h-4 w-4" /> {t('Iestatījumi', 'Settings')}
        </Button>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-500 hover:text-red-600"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" /> {t('Izrakstīties', 'Logout')}
        </Button>
      </div>
    </aside>
  );
}
