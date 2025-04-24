
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/users";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  forceRefresh?: boolean;
}

export function UserAvatar({ user, size = "md", forceRefresh = false }: UserAvatarProps) {
  const [refreshKey, setRefreshKey] = React.useState(Date.now());
  
  // Force update when avatar_url changes or when requested
  React.useEffect(() => {
    if (forceRefresh) {
      setRefreshKey(Date.now());
    }
  }, [user.avatar_url, forceRefresh]);
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };
  
  const getInitials = () => {
    const firstInitial = user.first_name ? user.first_name.charAt(0).toUpperCase() : '';
    const lastInitial = user.last_name ? user.last_name.charAt(0).toUpperCase() : '';
    
    if (firstInitial || lastInitial) {
      return `${firstInitial}${lastInitial}`;
    }
    
    // Fallback to email
    return user.email ? user.email.substring(0, 2).toUpperCase() : "U";
  };

  return (
    <Avatar className={`${sizeClasses[size]} border-2 border-primary/10`}>
      {user.avatar_url ? (
        <AvatarImage 
          src={`${user.avatar_url}?t=${refreshKey}`} 
          alt={user.first_name || "User"} 
          className="object-cover"
        />
      ) : (
        <AvatarFallback className="bg-orange-400 text-white">
          {getInitials()}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
