
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24"
  };
  
  // Effect to set the avatar URL with proper handling
  useEffect(() => {
    console.log("Avatar useEffect running, user:", user.id);
    
    if (!user) {
      console.log("No user provided to UserAvatar");
      setAvatarUrl(null);
      return;
    }
    
    console.log("User avatar_url:", user.avatar_url);
    
    // For demo users, check localStorage first
    if (user.id && user.id.startsWith('mock-user-id')) {
      const storedAvatar = localStorage.getItem('demo_user_avatar');
      if (storedAvatar) {
        console.log("Using localStorage avatar for demo user");
        setAvatarUrl(storedAvatar);
      } else {
        console.log("No localStorage avatar found for demo user");
        setAvatarUrl(null);
      }
    } else {
      // For regular users, use avatar_url with cache busting
      if (user.avatar_url) {
        const cacheBuster = forceRefresh ? `?t=${Date.now()}` : '';
        const url = `${user.avatar_url}${cacheBuster}`;
        console.log("Setting avatar URL with cache buster:", url);
        setAvatarUrl(url);
      } else {
        console.log("No avatar_url available for user");
        setAvatarUrl(null);
      }
    }
  }, [user, user?.id, user?.avatar_url, forceRefresh]);
  
  // Force refresh when forceRefresh prop changes
  useEffect(() => {
    if (forceRefresh && user?.avatar_url) {
      console.log("Force refresh triggered, updating avatar");
      setRefreshKey(Date.now());
    }
  }, [forceRefresh, user?.avatar_url]);
  
  const getInitials = () => {
    if (!user) return "?";
    
    // Get initials from first_name and last_name if available
    const firstInitial = user.first_name ? user.first_name.charAt(0).toUpperCase() : '';
    const lastInitial = user.last_name ? user.last_name.charAt(0).toUpperCase() : '';
    
    if (firstInitial || lastInitial) {
      return `${firstInitial}${lastInitial}`;
    }
    
    // Fallback to email if no name is available
    return user.email ? user.email.substring(0, 2).toUpperCase() : "?";
  };

  return (
    <Avatar className={`${sizeClasses[size]} border-2 border-primary/10`}>
      {avatarUrl && (
        <AvatarImage 
          src={avatarUrl} 
          alt={t("Lietotāja attēls", "User avatar")} 
          className="object-cover"
          key={refreshKey} // Add key to force refresh when avatar changes
          onError={(e) => {
            console.error("Error loading avatar image:", e);
            // On error, clear the avatarUrl to show the fallback
            setAvatarUrl(null);
          }}
        />
      )}
      <AvatarFallback className="bg-primary/10 text-primary">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
}
