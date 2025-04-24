
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Link } from "react-router-dom";
import { UserCircle, Mail, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { User } from "@/types/users";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Translations } from "@/features/language";

// Update the interface to accept the entire translations object
interface UserHoverCardProps {
  user: User;
  translations: Translations; // Changed from Record<string, string> to Translations
  onLogout: () => void;
  onLinkClick: () => void;
}

export function UserHoverCard({ user, translations, onLogout, onLinkClick }: UserHoverCardProps) {
  const { theme } = useTheme();
  
  // Get the auth translations using the getLoginTranslations function
  const authTranslations = {
    myAccount: translations.auth?.myAccount || "My Account",
    myTickets: translations.auth?.myTickets || "My Tickets",
    logout: translations.auth?.logout || "Logout"
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-orange-400 transition-colors relative z-10"
          title={authTranslations.myAccount}
        >
          <UserAvatar user={user} size="sm" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent 
        className={`w-64 p-0 overflow-hidden 
          ${theme === 'dark' ? 'dark:bg-gray-800 dark:border-gray-700' : ''}`}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-3 p-4 border-b">
            <UserAvatar user={user} size="md" />
            <div>
              <p className="font-medium text-sm">
                {user.first_name} {user.last_name}
              </p>
            </div>
          </div>
          
          <Link
            to={`/profile/${user.id}/account`}
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onLinkClick}
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm">{authTranslations.myAccount}</span>
          </Link>
          
          <Link
            to={`/profile/${user.id}/tickets`}
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onLinkClick}
          >
            <Mail className="h-4 w-4" />
            <span className="text-sm">{authTranslations.myTickets}</span>
          </Link>
          
          <div className="border-t">
            <Button
              variant="ghost"
              onClick={onLogout}
              className="flex items-center gap-2 w-full px-4 py-3 justify-start hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">{authTranslations.logout}</span>
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
