
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/users";

interface UserAvatarProps {
  user: User;
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
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
    <Avatar className={`border-2 border-ticket-accent ${className || ''}`}>
      <AvatarFallback className="bg-ticket-bg text-ticket-accent">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
}
