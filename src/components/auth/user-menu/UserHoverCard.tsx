
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Link } from "react-router-dom";
import { UserCircle, Mail, CreditCard, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { User } from "@/types/users";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/features/language";

interface UserHoverCardProps {
  user: User;
  onLogout: () => void;
  onLinkClick: () => void;
}

export function UserHoverCard({ user, onLogout, onLinkClick }: UserHoverCardProps) {
  const { theme } = useTheme();
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string, ruText?: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    if (currentLanguage.code === 'ru') return ruText || enText;
    return enText;
  };

  // Format email for display to prevent overflow
  const formatEmail = (email: string) => {
    if (!email) return "";
    
    if (email.length > 20) {
      const parts = email.split('@');
      if (parts.length === 2) {
        const username = parts[0];
        const domain = parts[1];
        
        if (username.length > 10) {
          return `${username.substring(0, 10)}...@${domain}`;
        }
      }
    }
    return email;
  };

  const menuItems = [
    {
      icon: <Settings className="h-4 w-4" />,
      label: t("Mans konts", "My Account", "Мой аккаунт"),
      path: `/profile/${user.id}/account`
    },
    {
      icon: <Mail className="h-4 w-4" />,
      label: t("Manas biļetes", "My Tickets", "Мои билеты"),
      path: `/profile/${user.id}/tickets`
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      label: t("Mani maksājumi", "My Payments", "Мои платежи"),
      path: `/profile/${user.id}/payments`
    }
  ];

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link 
          to={`/profile/${user.id}/account`}
          className="inline-flex items-center justify-center"
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-orange-400 transition-colors relative z-10 hover:bg-transparent"
            title={t("Mans konts", "My Account", "Мой аккаунт")}
          >
            <UserAvatar user={user} size="sm" />
          </Button>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent 
        className={`w-64 p-0 overflow-hidden 
          ${theme === 'dark' ? 'dark:bg-gray-800 dark:border-gray-700' : ''}`}
        onFocus={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-3 p-4 border-b">
            <UserAvatar user={user} size="md" />
            <div className="flex flex-col min-w-0 flex-1">
              <p className="font-medium text-sm whitespace-nowrap">
                {user.first_name} {user.last_name}
              </p>
              <div className="flex items-center">
                <p 
                  className="text-sm text-muted-foreground truncate max-w-full" 
                  title={user.email}
                >
                  {formatEmail(user.email)}
                </p>
              </div>
            </div>
          </div>
          
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={onLinkClick}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
          
          <div className="border-t">
            <Button
              variant="ghost"
              onClick={onLogout}
              className="flex items-center gap-2 w-full px-4 py-3 justify-start hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">{t("Iziet", "Logout", "Выйти")}</span>
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
