
import React from "react";
import { User } from "@/types/users";
import { AccountTab } from "./tabs/account";
import { TicketsTab } from "./tabs/tickets/TicketsTab";
import { LoadingSpinner } from "./components/LoadingSpinner";

interface ProfileContentProps {
  activeTab: string;
  user: User;
  onUserUpdate: (user: User) => void;
  isLoading: boolean;
}

export function ProfileContent({ activeTab, user, onUserUpdate, isLoading }: ProfileContentProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Renderējam atbilstošo sadaļu atkarībā no aktīvā taba
  switch (activeTab) {
    case "account":
      return <AccountTab user={user} onUserUpdate={onUserUpdate} />;
    case "tickets":
      return <TicketsTab user={user} />;
    default:
      return <AccountTab user={user} onUserUpdate={onUserUpdate} />;
  }
}
