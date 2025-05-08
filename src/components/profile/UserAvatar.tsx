
import React, { memo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/users";
import { useLanguage } from "@/features/language";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

const UserAvatarComponent = ({ user, size = "md" }: UserAvatarProps) => {
  const { currentLanguage } = useLanguage();
  
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

  return (
    <Avatar className={`${sizeClasses[size]} border-2 border-ticket-accent`}>
      <AvatarFallback className="bg-ticket-bg text-ticket-accent">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const UserAvatar = memo(UserAvatarComponent, (prevProps, nextProps) => {
  // Only re-render if user details that affect initials change
  return (
    prevProps.user.first_name === nextProps.user.first_name &&
    prevProps.user.last_name === nextProps.user.last_name &&
    prevProps.user.email === nextProps.user.email &&
    prevProps.size === nextProps.size
  );
});

// For debugging purposes
UserAvatar.displayName = 'UserAvatar';
