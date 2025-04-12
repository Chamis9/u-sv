
import React, { memo, useState, useEffect } from "react";
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

export const AdminSidebar = memo(function AdminSidebar({ 
  activeTab, 
  onTabChange, 
  userCount = 0, 
  subscriberCount: initialSubscriberCount = 0 
}: AdminSidebarProps) {
  const { translations } = useLanguage();
  const { logout } = useAuth();
  const [subscriberCount, setSubscriberCount] = useState(initialSubscriberCount);
  
  useEffect(() => {
    const handleSubscriberCountUpdate = (event: CustomEvent) => {
      setSubscriberCount(event.detail.count);
    };

    // Cast the event listener to match CustomEvent type
    const eventListener = ((e: Event) => {
      handleSubscriberCountUpdate(e as CustomEvent);
    }) as EventListener;

    window.addEventListener('subscriberCountUpdated', eventListener);
    
    return () => {
      window.removeEventListener('subscriberCountUpdated', eventListener);
    };
  }, []);
  
  const navItems = [
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

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold">{translations.admin?.title || 'Administrator Panel'}</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Button 
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => onTabChange(item.id)}
          >
            {item.icon} {item.label}
            {item.badge !== undefined && (
              <Badge className="ml-auto" variant="outline">{item.badge}</Badge>
            )}
          </Button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-500 hover:text-red-600"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" /> {translations.admin?.logout || 'Logout'}
        </Button>
      </div>
    </aside>
  );
});
