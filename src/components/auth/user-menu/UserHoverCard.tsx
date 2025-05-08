import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { User } from "@/types/users";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils"; // Import cn utility

// Keep the interface definition as is
interface UserHoverCardProps {
  user: User;
  onLogout: () => void;
  onLinkClick: () => void;
  children?: React.ReactNode;
}

// Update the component implementation with cn utility
export function UserHoverCard({
  user,
  onLogout,
  onLinkClick,
  children,
}: UserHoverCardProps) {
  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
            <UserAvatar user={user} />
          </Button>
        )}
      </HoverCardTrigger>
      
      <HoverCardContent 
        // Use className without cn utility
        className="w-80 z-50"
        align="end"
        side="bottom"
        forceMount
      >
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">
              {user.first_name} {user.last_name}
            </h4>
            <p className="text-xs text-muted-foreground">
              {user.email}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="default"
                size="sm"
                asChild
                onClick={onLinkClick}
              >
                <Link to={`/profile/${user.id}/account`}>
                  My Account
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
              >
                Logout
              </Button>
            </div>
          </div>
          <UserAvatar user={user} size="lg" />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
