
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/users";
import { useLanguage } from "@/features/language";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  forceRefresh?: boolean;
}

export function UserAvatar({ user, size = "md", forceRefresh = false }: UserAvatarProps) {
  const { currentLanguage } = useLanguage();
  const [cacheKey, setCacheKey] = useState<string>(Date.now().toString());
  
  useEffect(() => {
    if (forceRefresh) {
      setCacheKey(Date.now().toString());
    }
  }, [user.avatar_url, forceRefresh]);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24"
  };
  
  const getInitials = () => {
    if (!user) return "?";
    
    const firstInitial = user.first_name ? user.first_name.charAt(0).toUpperCase() : '';
    const lastInitial = user.last_name ? user.last_name.charAt(0).toUpperCase() : '';
    
    if (firstInitial || lastInitial) {
      return `${firstInitial}${lastInitial}`;
    }
    
    return user.email ? user.email.substring(0, 2).toUpperCase() : "?";
  };

  // Add cache busting if forceRefresh is true or avatarUrl has changed
  const avatarUrl = user.avatar_url ? `${user.avatar_url}?t=${cacheKey}` : undefined;

  return (
    <Avatar className={`${sizeClasses[size]} border-2 border-primary/10`}>
      {avatarUrl && (
        <AvatarImage 
          src={avatarUrl}
          alt={t("Lietotāja attēls", "User avatar")} 
          className="object-cover"
        />
      )}
      <AvatarFallback className="bg-primary/10 text-primary">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
}
