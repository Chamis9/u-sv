
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/features/language";
import { User as UserType } from "@/types/users";

interface UserHoverCardProps {
  user: UserType;
  onLogout: () => void;
  onLinkClick: () => void;
}

export function UserHoverCard({ user, onLogout, onLinkClick }: UserHoverCardProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => {
    return currentLanguage.code === 'lv' ? lvText : enText;
  };

  // Desktop: HoverCard, Mobile: DropdownMenu
  return (
    <>
      {/* Desktop */}
      <HoverCard closeDelay={200} openDelay={0} className="hidden md:block">
        <HoverCardTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-8 w-8 p-0 relative"
          >
            <Avatar className="h-8 w-8 border border-muted">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {`${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`}
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-64" align="end">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                {user.avatar_url ? (
                  <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {`${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">
                  {user.first_name} {user.last_name}
                </h4>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start gap-2" 
                asChild
              >
                <Link to={`/profile/${user.id}/account`} onClick={onLinkClick}>
                  <User size={14} />
                  {t('Mans profils', 'My profile')}
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start gap-2" 
                asChild
              >
                <Link to={`/profile/${user.id}/settings`} onClick={onLinkClick}>
                  <Settings size={14} />
                  {t('Iestatījumi', 'Settings')}
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start text-destructive hover:text-destructive gap-2"
                onClick={onLogout}
              >
                <LogOut size={14} />
                {t('Iziet', 'Log out')}
              </Button>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      
      {/* Mobile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-8 w-8 p-0"
          >
            <Avatar className="h-8 w-8">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {`${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`}
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center gap-2">
            <div>
              <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={`/profile/${user.id}/account`} onClick={onLinkClick} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              {t('Mans profils', 'My profile')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/profile/${user.id}/settings`} onClick={onLinkClick} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              {t('Iestatījumi', 'Settings')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={onLogout}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t('Iziet', 'Log out')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
