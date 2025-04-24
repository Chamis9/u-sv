
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/users";
import { useLanguage } from "@/features/language";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
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
    <Avatar className={`${sizeClasses[size]} border-2 border-primary/10`}>
      {user.avatar_url && (
        <AvatarImage 
          src={user.avatar_url}
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
