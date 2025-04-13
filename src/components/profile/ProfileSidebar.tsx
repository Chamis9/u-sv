
import React from "react";
import { useLanguage } from "@/features/language";
import { UserAvatar } from "./UserAvatar";
import { User } from "@/types/users";
import { useTheme } from "@/components/theme/ThemeProvider";
import {
  User as UserIcon,
  Ticket,
  CreditCard,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User | null;
}

export function ProfileSidebar({ activeTab, onTabChange, user }: ProfileSidebarProps) {
  const { currentLanguage } = useLanguage();
  const { theme } = useTheme();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const navItems = [
    {
      id: "account",
      icon: <UserIcon size={18} />,
      label: t("Mans konts", "My Account")
    },
    {
      id: "tickets",
      icon: <Ticket size={18} />,
      label: t("Manas biļetes", "My Tickets")
    },
    {
      id: "payments",
      icon: <CreditCard size={18} />,
      label: t("Mani maksājumi", "My Payments")
    },
    {
      id: "settings",
      icon: <Settings size={18} />,
      label: t("Iestatījumi", "Settings")
    }
  ];
  
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center space-y-2">
          <UserAvatar user={user || { id: "", email: "" }} size="lg" />
          <h2 className="text-xl font-semibold mt-2">
            {user ? user.name || t("Lietotājs", "User") : t("Lietotājs", "User")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {user ? user.email : ""}
          </p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Button 
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange(item.id)}
          >
            <span className="mr-2">{item.icon}</span> {item.label}
          </Button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          variant="destructive"
          className="w-full justify-start"
          onClick={() => console.log("Logout clicked")}
        >
          <LogOut size={18} className="mr-2" />
          {t("Iziet", "Logout")}
        </Button>
      </div>
    </aside>
  );
}
