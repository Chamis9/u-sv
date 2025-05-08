
import React from "react";
import { User } from "@/types/users";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, Settings, Ticket } from "lucide-react";
import { useLanguage } from "@/features/language";

interface UserHoverCardProps {
  user: User;
  onLogout: () => void;
  onLinkClick: () => void;
}

export function UserHoverCard({ user, onLogout, onLinkClick }: UserHoverCardProps) {
  const { currentLanguage } = useLanguage();
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  const userInitials = user.first_name && user.last_name 
    ? `${user.first_name[0]}${user.last_name[0]}` 
    : user.email?.substring(0, 2).toUpperCase() || '';

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button 
          variant="ghost" 
          className="p-0 hover:bg-transparent"
          aria-label={t('Lietotāja izvēlne', 'User menu')}
        >
          <Avatar className="h-8 w-8 text-ticket-accent">
            <AvatarImage src={user.avatar_url || ''} alt={user.first_name || 'User'} />
            <AvatarFallback className="bg-transparent border border-ticket-accent text-ticket-accent">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-60 p-4">
        <div className="flex justify-start items-center space-x-3">
          <Avatar>
            <AvatarImage src={user.avatar_url || ''} alt={user.first_name || ''} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">
              {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : t('Lietotājs', 'User')}
            </h4>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            asChild
            onClick={onLinkClick}
          >
            <Link to={`/profile/${user.id}/account`}>
              <UserIcon className="h-4 w-4 mr-2" />
              {t('Mans profils', 'My Profile')}
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            asChild
            onClick={onLinkClick}
          >
            <Link to={`/profile/${user.id}/tickets`}>
              <Ticket className="h-4 w-4 mr-2" />
              {t('Manas biļetes', 'My Tickets')}
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            asChild
            onClick={onLinkClick}
          >
            <Link to={`/profile/${user.id}/settings`}>
              <Settings className="h-4 w-4 mr-2" />
              {t('Iestatījumi', 'Settings')}
            </Link>
          </Button>
          
          <hr className="my-2" />
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('Iziet', 'Log out')}
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
