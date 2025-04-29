
import React, { useEffect, useState, memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/users";
import { useLanguage } from "@/features/language";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  forceRefresh?: boolean;
}

const UserAvatarComponent = ({ user, size = "md", forceRefresh = false }: UserAvatarProps) => {
  const { currentLanguage } = useLanguage();
  const [cacheKey, setCacheKey] = useState<string>(Date.now().toString());
  
  useEffect(() => {
    if (forceRefresh && user.avatar_url) {
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

  // Only add cache busting if the avatar URL exists and forceRefresh is true
  const avatarUrl = user.avatar_url 
    ? (forceRefresh ? `${user.avatar_url}?t=${cacheKey}` : user.avatar_url)
    : undefined;

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

// Memoize the component to prevent unnecessary re-renders
export const UserAvatar = memo(UserAvatarComponent, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.user.avatar_url === nextProps.user.avatar_url &&
    prevProps.size === nextProps.size &&
    prevProps.forceRefresh === nextProps.forceRefresh
  );
});

// For debugging purposes
UserAvatar.displayName = 'UserAvatar';
