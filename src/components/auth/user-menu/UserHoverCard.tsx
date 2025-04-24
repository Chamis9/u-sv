
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Link } from "react-router-dom";
import { UserCircle, Ticket, Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { User } from "@/types/users";
import { useTheme } from "@/components/theme/ThemeProvider";

interface UserHoverCardProps {
  user: User;
  translations: Record<string, string>;
  onLogout: () => void;
  onLinkClick: () => void;
}

export function UserHoverCard({ user, translations, onLogout, onLinkClick }: UserHoverCardProps) {
  const { theme } = useTheme();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          to={`/profile/${user.id}/account`}
          onClick={onLinkClick}
          className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors relative z-10"
          title="My Profile"
        >
          <UserAvatar user={user} size="sm" />
        </Link>
      </HoverCardTrigger>
      <HoverCardContent 
        className={`w-64 p-0 overflow-hidden rounded-md shadow-lg
          ${theme === 'dark' 
            ? 'dark:bg-gray-800 dark:border-gray-700' 
            : 'bg-white border-gray-200'}`}
      >
        <div className="flex flex-col">
          {/* User Header */}
          <div className="flex items-center gap-3 p-4 border-b dark:border-gray-700 border-gray-200">
            <UserAvatar user={user} size="md" />
            <div>
              <p className="font-medium text-base dark:text-white text-gray-900">
                {user.first_name} {user.last_name}
              </p>
            </div>
          </div>
          
          {/* Menu Links */}
          <div className="py-2">
            <Link
              to={`/profile/${user.id}/account`}
              className="menu-item"
              title={translations.myAccount}
            >
              <UserCircle className="menu-icon" />
            </Link>
            
            <Link
              to={`/profile/${user.id}/tickets`}
              className="menu-item"
              title={translations.myTickets}
            >
              <Ticket className="menu-icon" />
            </Link>
            
            <Link
              to={`/profile/${user.id}/payments`}
              className="menu-item"
              title={translations.myPayments}
            >
              <Wallet className="menu-icon" />
            </Link>
          </div>
          
          <div className="border-t dark:border-gray-700 border-gray-200">
            <Button
              variant="ghost"
              className="menu-item w-full justify-center"
              onClick={onLogout}
              title={translations.logout}
            >
              <LogOut className="menu-icon" />
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
